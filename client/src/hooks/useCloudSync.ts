import { useEffect, useState, useCallback } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';

export interface CloudConversation {
  id: string;
  title: string;
  messages: any[];
  models: string[];
  tags?: string[];
  timestamp: string;
}

interface UseCloudSyncOptions {
  onSyncComplete?: () => void;
  onSyncError?: (error: Error) => void;
}

export function useCloudSync(options: UseCloudSyncOptions = {}) {
  const { user, isAuthenticated } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // tRPC queries
  const recentQuery = trpc.conversations.listRecent.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const archivedQuery = trpc.conversations.listArchived.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // tRPC mutations
  const createMutation = trpc.conversations.create.useMutation();
  const updateMutation = trpc.conversations.update.useMutation();
  const deleteMutation = trpc.conversations.delete.useMutation();
  const archiveMutation = trpc.conversations.archive.useMutation();
  const unarchiveMutation = trpc.conversations.unarchive.useMutation();
  const syncMutation = trpc.conversations.sync.useMutation();

  // Parse cloud conversations to local format
  const parseCloudConversation = useCallback((cloud: any): CloudConversation => {
    return {
      id: cloud.id,
      title: cloud.title,
      messages: JSON.parse(cloud.messages || '[]'),
      models: JSON.parse(cloud.models || '[]'),
      tags: cloud.tags ? JSON.parse(cloud.tags) : undefined,
      timestamp: cloud.updatedAt?.toISOString?.() || cloud.updatedAt || new Date().toISOString(),
    };
  }, []);

  // Get recent conversations from cloud
  const getRecentConversations = useCallback((): CloudConversation[] => {
    if (!recentQuery.data) return [];
    return recentQuery.data.map(parseCloudConversation);
  }, [recentQuery.data, parseCloudConversation]);

  // Get archived conversations from cloud
  const getArchivedConversations = useCallback((): CloudConversation[] => {
    if (!archivedQuery.data) return [];
    return archivedQuery.data.map(parseCloudConversation);
  }, [archivedQuery.data, parseCloudConversation]);

  // Save a conversation to cloud
  const saveConversation = useCallback(async (conversation: CloudConversation, isArchived: boolean = false) => {
    if (!isAuthenticated) {
      console.warn('Cannot save to cloud: not authenticated');
      return false;
    }

    try {
      await createMutation.mutateAsync({
        id: conversation.id,
        title: conversation.title,
        messages: JSON.stringify(conversation.messages),
        models: JSON.stringify(conversation.models),
        tags: conversation.tags ? JSON.stringify(conversation.tags) : undefined,
        isArchived,
      });
      
      // Refetch to update local cache
      await recentQuery.refetch();
      await archivedQuery.refetch();
      
      return true;
    } catch (error) {
      console.error('Failed to save conversation to cloud:', error);
      options.onSyncError?.(error as Error);
      return false;
    }
  }, [isAuthenticated, createMutation, recentQuery, archivedQuery, options]);

  // Update a conversation in cloud
  const updateCloudConversation = useCallback(async (conversation: Partial<CloudConversation> & { id: string }, isArchived?: boolean) => {
    if (!isAuthenticated) {
      console.warn('Cannot update cloud: not authenticated');
      return false;
    }

    try {
      const updateData: any = { id: conversation.id };
      if (conversation.title !== undefined) updateData.title = conversation.title;
      if (conversation.messages !== undefined) updateData.messages = JSON.stringify(conversation.messages);
      if (conversation.models !== undefined) updateData.models = JSON.stringify(conversation.models);
      if (conversation.tags !== undefined) updateData.tags = JSON.stringify(conversation.tags);
      if (isArchived !== undefined) updateData.isArchived = isArchived;

      await updateMutation.mutateAsync(updateData);
      
      // Refetch to update local cache
      await recentQuery.refetch();
      await archivedQuery.refetch();
      
      return true;
    } catch (error) {
      console.error('Failed to update conversation in cloud:', error);
      options.onSyncError?.(error as Error);
      return false;
    }
  }, [isAuthenticated, updateMutation, recentQuery, archivedQuery, options]);

  // Delete a conversation from cloud
  const deleteCloudConversation = useCallback(async (id: string) => {
    if (!isAuthenticated) {
      console.warn('Cannot delete from cloud: not authenticated');
      return false;
    }

    try {
      await deleteMutation.mutateAsync({ id });
      
      // Refetch to update local cache
      await recentQuery.refetch();
      await archivedQuery.refetch();
      
      return true;
    } catch (error) {
      console.error('Failed to delete conversation from cloud:', error);
      options.onSyncError?.(error as Error);
      return false;
    }
  }, [isAuthenticated, deleteMutation, recentQuery, archivedQuery, options]);

  // Archive a conversation
  const archiveCloudConversation = useCallback(async (id: string) => {
    if (!isAuthenticated) return false;

    try {
      await archiveMutation.mutateAsync({ id });
      await recentQuery.refetch();
      await archivedQuery.refetch();
      return true;
    } catch (error) {
      console.error('Failed to archive conversation:', error);
      options.onSyncError?.(error as Error);
      return false;
    }
  }, [isAuthenticated, archiveMutation, recentQuery, archivedQuery, options]);

  // Unarchive a conversation
  const unarchiveCloudConversation = useCallback(async (id: string) => {
    if (!isAuthenticated) return false;

    try {
      await unarchiveMutation.mutateAsync({ id });
      await recentQuery.refetch();
      await archivedQuery.refetch();
      return true;
    } catch (error) {
      console.error('Failed to unarchive conversation:', error);
      options.onSyncError?.(error as Error);
      return false;
    }
  }, [isAuthenticated, unarchiveMutation, recentQuery, archivedQuery, options]);

  // Full sync: upload all local conversations to cloud
  const syncAllToCloud = useCallback(async (
    localRecent: CloudConversation[],
    localArchived: CloudConversation[]
  ) => {
    if (!isAuthenticated) {
      console.warn('Cannot sync to cloud: not authenticated');
      return false;
    }

    setIsSyncing(true);

    try {
      const allConversations = [
        ...localRecent.map(c => ({ ...c, isArchived: false })),
        ...localArchived.map(c => ({ ...c, isArchived: true })),
      ];

      await syncMutation.mutateAsync({
        conversations: allConversations.map(c => ({
          id: c.id,
          title: c.title,
          messages: JSON.stringify(c.messages),
          models: JSON.stringify(c.models),
          tags: c.tags ? JSON.stringify(c.tags) : undefined,
          isArchived: c.isArchived,
        })),
      });

      // Refetch to update local cache
      await recentQuery.refetch();
      await archivedQuery.refetch();

      setLastSyncTime(new Date());
      options.onSyncComplete?.();
      return true;
    } catch (error) {
      console.error('Failed to sync conversations to cloud:', error);
      options.onSyncError?.(error as Error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, syncMutation, recentQuery, archivedQuery, options]);

  // Refresh data from cloud
  const refreshFromCloud = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsSyncing(true);
    try {
      await recentQuery.refetch();
      await archivedQuery.refetch();
      setLastSyncTime(new Date());
      options.onSyncComplete?.();
    } catch (error) {
      console.error('Failed to refresh from cloud:', error);
      options.onSyncError?.(error as Error);
    } finally {
      setIsSyncing(false);
    }
  }, [isAuthenticated, recentQuery, archivedQuery, options]);

  return {
    // State
    isAuthenticated,
    isSyncing,
    lastSyncTime,
    isLoading: recentQuery.isLoading || archivedQuery.isLoading,
    
    // Data
    cloudRecentConversations: getRecentConversations(),
    cloudArchivedConversations: getArchivedConversations(),
    
    // Actions
    saveConversation,
    updateCloudConversation,
    deleteCloudConversation,
    archiveCloudConversation,
    unarchiveCloudConversation,
    syncAllToCloud,
    refreshFromCloud,
  };
}
