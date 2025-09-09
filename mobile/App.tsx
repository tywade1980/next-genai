import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { apiClient, User, CallRecord, CBMSProject, syncManager } from '@next-genai/shared';

export default function App(): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [projects, setProjects] = useState<CBMSProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Login with demo credentials
        const loginResponse = await apiClient.login({
          email: 'demo@example.com',
          password: 'demo123',
        });

        if (loginResponse.success && loginResponse.data) {
          apiClient.setToken(loginResponse.data.token);
          setUser(loginResponse.data.user);

          // Initialize sync manager
          syncManager.setToken(loginResponse.data.token);
          await syncManager.connect();
          setIsConnected(true);

          // Subscribe to sync events
          syncManager.subscribe('*', (event) => {
            console.log('Sync event received:', event);
            // Handle sync events (refresh data)
            loadData();
          });

          // Load initial data
          await loadData();
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
        Alert.alert('Error', 'Failed to load application data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();

    return () => {
      syncManager.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      const [callsResponse, projectsResponse] = await Promise.all([
        apiClient.getCallRecords(),
        apiClient.getProjects(),
      ]);

      if (callsResponse.success && callsResponse.data) {
        setCalls(callsResponse.data);
      }

      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading Next GenAI...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Next GenAI Mobile</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#34D399' : '#EF4444' }]} />
          <Text style={styles.statusText}>
            {user ? `Welcome, ${user.name}` : 'Not logged in'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Call Records Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Calls</Text>
          {calls.length > 0 ? (
            calls.map((call) => (
              <View key={call.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{call.phoneNumber}</Text>
                  <View style={[styles.badge, styles[`badge${call.status.charAt(0).toUpperCase() + call.status.slice(1)}` as keyof typeof styles]]}>
                    <Text style={styles.badgeText}>{call.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardDetail}>Duration: {formatDuration(call.duration)}</Text>
                <Text style={styles.cardDetail}>AI Model: {call.aiModelUsed}</Text>
                {call.summary && (
                  <Text style={styles.cardSummary}>{call.summary}</Text>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No call records found.</Text>
          )}
        </View>

        {/* CBMS Projects Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CBMS Projects</Text>
          {projects.length > 0 ? (
            projects.map((project) => (
              <View key={project.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{project.name}</Text>
                  <View style={[styles.badge, styles[`badge${project.status.charAt(0).toUpperCase() + project.status.slice(1)}` as keyof typeof styles]]}>
                    <Text style={styles.badgeText}>{project.status}</Text>
                  </View>
                </View>
                <Text style={styles.cardDetail}>{project.description}</Text>
                <Text style={styles.cardDetail}>
                  Budget: ${project.budget.toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No projects found.</Text>
          )}
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Features</Text>
          <View style={styles.featureGrid}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>AI Models</Text>
              <Text style={styles.featureText}>GPT-4, Claude-3, Gemini-Pro</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Real-time Sync</Text>
              <Text style={styles.featureText}>WebSocket connection</Text>
            </View>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>Cross-platform</Text>
              <Text style={styles.featureText}>Web & Mobile APK</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
          <Text style={styles.refreshButtonText}>Refresh Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#374151',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  cardDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  cardSummary: {
    fontSize: 14,
    color: '#374151',
    marginTop: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeCompleted: {
    backgroundColor: '#D1FAE5',
  },
  badgeFailed: {
    backgroundColor: '#FEE2E2',
  },
  badgeInProgress: {
    backgroundColor: '#FEF3C7',
  },
  badgeActive: {
    backgroundColor: '#DBEAFE',
  },
  badgeOnHold: {
    backgroundColor: '#F3F4F6',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    padding: 16,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 12,
    color: '#6B7280',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});