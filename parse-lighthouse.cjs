const fs = require('fs');
const data = JSON.parse(fs.readFileSync('c:/Users/saavi/Downloads/vishwakarmaknowledgecentre.org-20260531T091841.json', 'utf8'));

// Only looking at accessibility audits
const failed = Object.values(data.audits).filter(a => 
  a.score !== null && a.score < 1 && data.categories.accessibility.auditRefs.some(ref => ref.id === a.id)
);

failed.forEach(a => {
  console.log(`[${a.id}] Score: ${a.score} - ${a.title}`);
  if (a.details && a.details.items) {
    console.log(JSON.stringify(a.details.items.slice(0, 3), null, 2));
  }
});
