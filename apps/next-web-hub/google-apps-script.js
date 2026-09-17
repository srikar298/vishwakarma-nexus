/**
 * ============================================================================
 * VISHWAKARMA NEXUS — GOOGLE APPS SCRIPT WEBHOOK ENGINE
 * ============================================================================
 * Features:
 *  1. Concurrency Control: Uses LockService to prevent race conditions.
 *  2. Phone Normalization: Standardizes mobile numbers to canonical 10 digits.
 *  3. Smart In-Place Deduplication (Upsert):
 *     - If phone + track exists -> updates existing row, preserves Member ID,
 *       updates "Last Updated" timestamp, increments submission count.
 *     - If new -> creates a clean new member row.
 *  4. Multi-Track Support: Same phone can enroll in separate verticals
 *     (e.g. Artisan ID + Ekta Yatra + Matrimony) without collision.
 *  5. Auto-Formattng: Automatically creates header, freezes top row, and styles.
 *  6. Health Check: GET endpoint for instant browser testing.
 * ============================================================================
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  
  try {
    // Wait up to 15 seconds for any concurrent request to clear
    lock.waitLock(15000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    // 1. Sanitize Phone to canonical last 10 digits
    var rawPhone = String(data.phone || '');
    var cleanPhone = rawPhone.replace(/\D/g, '').slice(-10);

    var lastRow = sheet.getLastRow();

    // 2. Auto-initialize Header if the sheet is completely blank
    if (lastRow === 0) {
      sheet.appendRow([
        "Registered At",
        "Last Updated",
        "Member ID",
        "Full Name",
        "WhatsApp Mobile",
        "Category / Track",
        "Pancha Brahma Lineage",
        "District / State",
        "Mandal / Town",
        "Craft / Profession / Trade",
        "Matrimony Details",
        "Artisan Status / PM Scheme",
        "Yatra Seva / Company / Notes",
        "Submission Count"
      ]);

      // Style header row: Amber Gold background, white bold text
      var headerRange = sheet.getRange(1, 1, 1, 14);
      headerRange.setBackground("#D97706");
      headerRange.setFontColor("#FFFFFF");
      headerRange.setFontWeight("bold");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
      lastRow = 1;
    }

    // 3. Format Category Summaries
    var matrimonySummary = "-";
    if (data.track === 'matrimony') {
      matrimonySummary = (data.matrimonyLookingFor === 'groom' ? 'Groom (Varudu)' : 'Bride (Vadhu)') +
        (data.matrimonyAge ? " | Age: " + data.matrimonyAge : "") +
        (data.matrimonyEducation ? " | Edu: " + data.matrimonyEducation : "") +
        (data.workCity ? " | City: " + data.workCity : "");
    }

    var artisanSummary = "-";
    if (data.track === 'artisan') {
      artisanSummary = (data.workshopType || "Artisan") +
        (data.pmVishwakarmaInterest === 'Yes' ? " | PM Scheme Enrolled" : "");
    }

    var additionalNotes = data.notes || "";
    if (data.yatraSeva) {
      additionalNotes = "Yatra Seva: " + data.yatraSeva + (data.trade ? " | " + data.trade : "") + (additionalNotes ? " | " + additionalNotes : "");
    } else if (data.company) {
      additionalNotes = "Company: " + data.company + (data.youthReferralInterest === 'Yes' ? " | Open to Youth Mentorship" : "") + (additionalNotes ? " | " + additionalNotes : "");
    }

    // 4. Scan Sheet for Existing Registrations (Matching Phone + Track)
    var existingRowIndex = -1;
    var existingMemberId = null;
    var submissionCount = 1;

    if (lastRow > 1 && cleanPhone.length === 10) {
      // Read all rows (Columns: E=Phone, F=Track, C=MemberID, N=Count)
      var allRows = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
      for (var i = 0; i < allRows.length; i++) {
        var rowPhone = String(allRows[i][4]).replace(/\D/g, '').slice(-10);
        var rowTrack = String(allRows[i][5]).toLowerCase();
        var incomingTrack = String(data.track || '').toLowerCase();

        // Exact match on 10-digit mobile and category track
        if (rowPhone === cleanPhone && rowTrack === incomingTrack) {
          existingRowIndex = i + 2; // Offset for 1-based indexing + header
          existingMemberId = allRows[i][2];
          submissionCount = (parseInt(allRows[i][13], 10) || 1) + 1;
          break;
        }
      }
    }

    // Preserve existing Member ID or use incoming
    var finalMemberId = existingMemberId || data.memberId || data.uid || "N/A";

    // 5. UPSERT LOGIC
    if (existingRowIndex > 1) {
      // A. DUPLICATE FOUND: Update existing row in-place
      sheet.getRange(existingRowIndex, 2).setValue(new Date()); // Last Updated
      if (data.name) sheet.getRange(existingRowIndex, 4).setValue(data.name);
      if (data.lineage) sheet.getRange(existingRowIndex, 7).setValue(data.lineage);
      if (data.location) sheet.getRange(existingRowIndex, 8).setValue(data.location);
      if (data.mandal) sheet.getRange(existingRowIndex, 9).setValue(data.mandal);
      if (data.trade) sheet.getRange(existingRowIndex, 10).setValue(data.trade);
      if (matrimonySummary !== "-") sheet.getRange(existingRowIndex, 11).setValue(matrimonySummary);
      if (artisanSummary !== "-") sheet.getRange(existingRowIndex, 12).setValue(artisanSummary);
      if (additionalNotes) sheet.getRange(existingRowIndex, 13).setValue(additionalNotes);
      sheet.getRange(existingRowIndex, 14).setValue(submissionCount);

      return ContentService.createTextOutput(JSON.stringify({ 
        result: "success", 
        action: "updated_existing", 
        memberId: finalMemberId,
        isExisting: true,
        submissionCount: submissionCount
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      // B. NEW MEMBER: Append clean row
      sheet.appendRow([
        new Date(),
        new Date(),
        finalMemberId,
        data.name || "N/A",
        "'" + cleanPhone, // Apostrophe prevents scientific notation & preserves zero
        data.track || data.category || "General",
        data.lineage || "-",
        data.location || data.state || "N/A",
        data.mandal || "-",
        data.trade || data.profession || "N/A",
        matrimonySummary,
        artisanSummary,
        additionalNotes,
        1
      ]);

      return ContentService.createTextOutput(JSON.stringify({ 
        result: "success", 
        action: "created_new", 
        memberId: finalMemberId,
        isExisting: false,
        submissionCount: 1
      })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      result: "error", 
      error: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Browser GET health check
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ 
    status: "active", 
    service: "Vishwakarma Nexus Registry Engine",
    features: ["ConcurrencyLock", "PhoneSanitization", "InPlaceDeduplication", "MultiTrack"]
  })).setMimeType(ContentService.MimeType.JSON);
}
