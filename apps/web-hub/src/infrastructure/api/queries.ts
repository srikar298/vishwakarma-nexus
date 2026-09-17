import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  NexusApi,
  type RegisterPayload,
  type RegisterResponse,
  type LoginPayload,
  type LoginResponse,
  type IdCardResponse,
  type VerificationData,
  type SearchMembersParams,
  type SearchMembersResponse,
} from './nexus-api';
import { useAuthStore } from '../state/authStore';

// Query Keys Constants
export const QUERY_KEYS = {
  idCard: ['members', 'me', 'id-card'] as const,
  verify: (digitalId: string) => ['members', 'verify', digitalId] as const,
  directory: (params?: SearchMembersParams) => ['members', 'search', params] as const,
};

/**
 * Hook to retrieve the current user's digital ID card (SVG + verification URL).
 * Only fires if the user is authenticated.
 */
export function useIdCard() {
  const token = useAuthStore((state) => state.token);

  return useQuery<IdCardResponse, Error>({
    queryKey: QUERY_KEYS.idCard,
    queryFn: () => NexusApi.getIdCard(),
    enabled: !!token,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Hook to verify a digital ID publicly.
 */
export function useVerifyId(digitalId: string) {
  return useQuery<VerificationData, Error>({
    queryKey: QUERY_KEYS.verify(digitalId),
    queryFn: () => NexusApi.verifyDigitalId(digitalId),
    enabled: !!digitalId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to query live registered members in the directory.
 */
export function useMemberDirectory(params?: SearchMembersParams) {
  const token = useAuthStore((state) => state.token);

  return useQuery<SearchMembersResponse, Error>({
    queryKey: QUERY_KEYS.directory(params),
    queryFn: () => NexusApi.searchMembers(params),
    enabled: !!token, // Backend search endpoint requires authentication
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Mutation hook for 4-step registration.
 * Updates the global auth store and invalidates ID card cache on success.
 */
export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<RegisterResponse, Error, RegisterPayload>({
    mutationFn: (payload: RegisterPayload) => NexusApi.register(payload),
    onSuccess: (data) => {
      setAuth(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        {
          publicId: data.user.publicId,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
          digitalId: data.profile.digitalId,
          phone: data.profile.phone,
          kula: data.profile.kula,
          trade: data.profile.trade,
          district: data.profile.district,
          mandal: data.profile.mandal,
          state: data.profile.state,
        }
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.idCard });
    },
  });
}

/**
 * Mutation hook for Phone/Email + MPIN login.
 * Updates the global auth store and invalidates ID card cache on success.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (payload: LoginPayload) => NexusApi.login(payload),
    onSuccess: (data) => {
      setAuth(
        data.tokens.accessToken,
        data.tokens.refreshToken,
        {
          publicId: data.user.publicId,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
          digitalId: data.profile?.digitalId,
          phone: data.profile?.phone,
          kula: data.profile?.kula,
          trade: data.profile?.trade,
          district: data.profile?.district,
          mandal: data.profile?.mandal,
          state: data.profile?.state,
        }
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.idCard });
    },
  });
}

/**
 * Mutation hook for progressive GPS location capture.
 */
export function useUpdateLocationMutation() {
  return useMutation<any, Error, { latitude: number; longitude: number }>({
    mutationFn: (coords) => NexusApi.updateLocation(coords),
  });
}
