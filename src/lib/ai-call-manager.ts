import { CallRecord, AIAnalysis, CallIntent, CallType } from '@/types';

export class AICallManager {
  private callHistory: CallRecord[] = [];
  
  /**
   * Analyze incoming call using AI models
   */
  async analyzeCall(
    phoneNumber: string,
    callerName: string | undefined,
    callType: CallType,
    duration: number,
    transcript?: string
  ): Promise<CallRecord> {
    const analysis = await this.performAIAnalysis(transcript || '');
    
    const callRecord: CallRecord = {
      id: `CALL-${Date.now()}`,
      phoneNumber,
      callerName,
      callType,
      duration,
      timestamp: new Date(),
      aiAnalysis: analysis,
      disposition: 'answered',
      followUpRequired: this.determineFollowUpRequired(analysis),
      projectId: this.extractProjectId(analysis)
    };

    this.callHistory.push(callRecord);
    return callRecord;
  }

  /**
   * Perform AI analysis on call transcript
   */
  private async performAIAnalysis(transcript: string): Promise<AIAnalysis> {
    // Simulate AI analysis - in production, this would call actual AI models
    const keywords = this.extractKeywords(transcript);
    const intent = this.determineIntent(transcript, keywords);
    const sentiment = this.analyzeSentiment(transcript);
    const confidence = this.calculateConfidence(transcript, intent, sentiment);
    const summary = this.generateSummary(transcript, intent);
    const actionItems = this.extractActionItems(transcript, intent);

    return {
      sentiment,
      intent,
      confidence,
      keywords,
      summary,
      actionItems
    };
  }

  /**
   * Extract keywords from transcript
   */
  private extractKeywords(transcript: string): string[] {
    const constructionKeywords = [
      'estimate', 'quote', 'construction', 'build', 'renovation', 'remodel',
      'foundation', 'roofing', 'framing', 'electrical', 'plumbing', 'hvac',
      'commercial', 'residential', 'project', 'contractor', 'permit',
      'timeline', 'schedule', 'budget', 'cost', 'materials', 'labor'
    ];

    const emergencyKeywords = [
      'emergency', 'urgent', 'leak', 'flood', 'fire', 'damage', 'broken',
      'immediate', 'asap', 'help', 'problem', 'issue'
    ];

    const allKeywords = [...constructionKeywords, ...emergencyKeywords];
    const lowerTranscript = transcript.toLowerCase();
    
    return allKeywords.filter(keyword => 
      lowerTranscript.includes(keyword)
    );
  }

  /**
   * Determine call intent based on transcript and keywords
   */
  private determineIntent(transcript: string, keywords: string[]): CallIntent {
    const lowerTranscript = transcript.toLowerCase();

    // Emergency detection
    if (keywords.some(k => ['emergency', 'urgent', 'leak', 'flood', 'fire', 'damage'].includes(k))) {
      return 'emergency';
    }

    // Quote/estimate request
    if (keywords.some(k => ['estimate', 'quote', 'cost', 'budget'].includes(k))) {
      return 'quote-request';
    }

    // Project inquiry
    if (keywords.some(k => ['project', 'build', 'construction', 'renovation'].includes(k))) {
      return 'project-inquiry';
    }

    // Payment related
    if (lowerTranscript.includes('payment') || lowerTranscript.includes('invoice') || 
        lowerTranscript.includes('bill')) {
      return 'payment';
    }

    // Scheduling
    if (keywords.some(k => ['schedule', 'timeline', 'appointment'].includes(k))) {
      return 'scheduling';
    }

    // Complaint
    if (lowerTranscript.includes('complaint') || lowerTranscript.includes('unsatisfied') ||
        lowerTranscript.includes('problem')) {
      return 'complaint';
    }

    return 'general-inquiry';
  }

  /**
   * Analyze sentiment of the call
   */
  private analyzeSentiment(transcript: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['great', 'excellent', 'happy', 'satisfied', 'good', 'wonderful', 'amazing'];
    const negativeWords = ['bad', 'terrible', 'awful', 'disappointed', 'angry', 'frustrated', 'horrible'];
    
    const lowerTranscript = transcript.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerTranscript.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerTranscript.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Calculate confidence score for the analysis
   */
  private calculateConfidence(transcript: string, intent: CallIntent, sentiment: string): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on transcript length and clarity
    if (transcript.length > 100) confidence += 0.2;
    if (transcript.length > 300) confidence += 0.1;

    // Increase confidence based on intent clarity
    const intentKeywords = {
      'emergency': ['emergency', 'urgent', 'immediate'],
      'quote-request': ['estimate', 'quote', 'cost'],
      'project-inquiry': ['project', 'build', 'construction'],
      'payment': ['payment', 'invoice', 'bill'],
      'scheduling': ['schedule', 'appointment', 'timeline'],
      'complaint': ['complaint', 'problem', 'issue'],
      'general-inquiry': []
    };

    const relevantKeywords = intentKeywords[intent] || [];
    const keywordMatches = relevantKeywords.filter(keyword => 
      transcript.toLowerCase().includes(keyword)
    ).length;

    confidence += keywordMatches * 0.1;

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  /**
   * Generate a summary of the call
   */
  private generateSummary(transcript: string, intent: CallIntent): string {
    const intentSummaries = {
      'emergency': 'Emergency call requiring immediate attention.',
      'quote-request': 'Customer requesting a quote for construction services.',
      'project-inquiry': 'General inquiry about construction project services.',
      'payment': 'Call regarding payment or billing matters.',
      'scheduling': 'Customer looking to schedule an appointment or service.',
      'complaint': 'Customer complaint that requires follow-up.',
      'general-inquiry': 'General inquiry about services.'
    };

    let summary = intentSummaries[intent];
    
    if (transcript.length > 50) {
      summary += ` Call duration suggests detailed discussion.`;
    }

    return summary;
  }

  /**
   * Extract action items from the call
   */
  private extractActionItems(transcript: string, intent: CallIntent): string[] {
    const actionItems: string[] = [];

    switch (intent) {
      case 'emergency':
        actionItems.push('Dispatch emergency response team immediately');
        actionItems.push('Follow up within 1 hour');
        break;
      case 'quote-request':
        actionItems.push('Prepare detailed estimate');
        actionItems.push('Schedule site visit if needed');
        actionItems.push('Follow up with quote within 24-48 hours');
        break;
      case 'project-inquiry':
        actionItems.push('Send project information packet');
        actionItems.push('Schedule consultation call');
        break;
      case 'payment':
        actionItems.push('Review payment status');
        actionItems.push('Send invoice copy if requested');
        break;
      case 'scheduling':
        actionItems.push('Check availability and schedule appointment');
        actionItems.push('Send confirmation details');
        break;
      case 'complaint':
        actionItems.push('Investigate complaint details');
        actionItems.push('Schedule resolution meeting');
        actionItems.push('Follow up within 24 hours');
        break;
      default:
        actionItems.push('Follow up as appropriate');
    }

    return actionItems;
  }

  /**
   * Determine if follow-up is required
   */
  private determineFollowUpRequired(analysis: AIAnalysis): boolean {
    return analysis.intent !== 'general-inquiry' || analysis.sentiment === 'negative';
  }

  /**
   * Extract project ID if mentioned in the call
   */
  private extractProjectId(analysis: AIAnalysis): string | undefined {
    // Look for project references in keywords
    const projectKeywords = analysis.keywords.filter(k => 
      k.toLowerCase().includes('project') || 
      k.toLowerCase().includes('job')
    );
    
    return projectKeywords.length > 0 ? `PROJECT-${Date.now()}` : undefined;
  }

  /**
   * Get call statistics
   */
  getCallStatistics(days: number = 30): CallStatistics {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentCalls = this.callHistory.filter(call => call.timestamp >= cutoffDate);
    
    const totalCalls = recentCalls.length;
    const emergencyCalls = recentCalls.filter(call => call.aiAnalysis.intent === 'emergency').length;
    const quoteRequests = recentCalls.filter(call => call.aiAnalysis.intent === 'quote-request').length;
    const complaints = recentCalls.filter(call => call.aiAnalysis.intent === 'complaint').length;
    
    const avgDuration = totalCalls > 0 ? 
      recentCalls.reduce((sum, call) => sum + call.duration, 0) / totalCalls : 0;
    
    const positiveRate = totalCalls > 0 ? 
      recentCalls.filter(call => call.aiAnalysis.sentiment === 'positive').length / totalCalls : 0;

    return {
      totalCalls,
      emergencyCalls,
      quoteRequests,
      complaints,
      avgDuration,
      positiveRate,
      followUpRequired: recentCalls.filter(call => call.followUpRequired).length
    };
  }

  /**
   * Get high-priority calls requiring immediate attention
   */
  getHighPriorityCalls(): CallRecord[] {
    return this.callHistory.filter(call => 
      call.aiAnalysis.intent === 'emergency' ||
      (call.aiAnalysis.intent === 'complaint' && call.aiAnalysis.sentiment === 'negative') ||
      call.followUpRequired
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Generate automated response suggestions
   */
  generateResponseSuggestions(callRecord: CallRecord): string[] {
    const suggestions: string[] = [];
    
    switch (callRecord.aiAnalysis.intent) {
      case 'emergency':
        suggestions.push('We understand this is urgent. Our emergency team will be dispatched immediately.');
        suggestions.push('Can you provide your exact location and describe the immediate safety concerns?');
        break;
      case 'quote-request':
        suggestions.push('We\'d be happy to provide a detailed estimate for your project.');
        suggestions.push('Could you share some details about the scope of work you\'re considering?');
        suggestions.push('Would you prefer an on-site consultation or can we start with the information you have?');
        break;
      case 'project-inquiry':
        suggestions.push('Thank you for your interest in our construction services.');
        suggestions.push('What type of project are you planning - residential, commercial, or renovation?');
        break;
      case 'complaint':
        suggestions.push('We sincerely apologize for any inconvenience you\'ve experienced.');
        suggestions.push('Let me connect you with our project manager to resolve this immediately.');
        break;
      case 'scheduling':
        suggestions.push('I can help you schedule an appointment. What works best for your schedule?');
        suggestions.push('Our next available slots are...');
        break;
      default:
        suggestions.push('Thank you for calling. How can we help you today?');
    }

    return suggestions;
  }
}

interface CallStatistics {
  totalCalls: number;
  emergencyCalls: number;
  quoteRequests: number;
  complaints: number;
  avgDuration: number;
  positiveRate: number;
  followUpRequired: number;
}

// Smart receptionist dialer functionality
export class SmartDialer {
  private dialQueue: DialEntry[] = [];
  
  /**
   * Add number to dial queue with priority
   */
  addToDialQueue(
    phoneNumber: string,
    contactName: string,
    purpose: string,
    priority: 'high' | 'medium' | 'low' = 'medium',
    scheduledTime?: Date
  ): void {
    const entry: DialEntry = {
      id: `DIAL-${Date.now()}`,
      phoneNumber,
      contactName,
      purpose,
      priority,
      scheduledTime: scheduledTime || new Date(),
      attempts: 0,
      status: 'pending',
      createdAt: new Date()
    };

    this.dialQueue.push(entry);
    this.sortDialQueue();
  }

  /**
   * Get next number to dial
   */
  getNextToDial(): DialEntry | null {
    const now = new Date();
    const availableEntries = this.dialQueue.filter(entry => 
      entry.status === 'pending' && 
      entry.scheduledTime <= now &&
      entry.attempts < 3
    );

    return availableEntries.length > 0 ? availableEntries[0] : null;
  }

  /**
   * Mark dial attempt as completed
   */
  markDialCompleted(dialId: string, outcome: DialOutcome, notes?: string): void {
    const entry = this.dialQueue.find(e => e.id === dialId);
    if (entry) {
      entry.attempts++;
      entry.lastAttempt = new Date();
      entry.notes = notes;
      
      if (outcome === 'completed' || outcome === 'no-answer' || entry.attempts >= 3) {
        entry.status = outcome === 'completed' ? 'completed' : 'failed';
      } else {
        // Reschedule for retry
        entry.scheduledTime = new Date(Date.now() + 3600000); // 1 hour later
      }
    }
  }

  /**
   * Sort dial queue by priority and scheduled time
   */
  private sortDialQueue(): void {
    const priorityValues = { high: 3, medium: 2, low: 1 };
    
    this.dialQueue.sort((a, b) => {
      // First by priority
      const priorityDiff = priorityValues[b.priority] - priorityValues[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by scheduled time
      return a.scheduledTime.getTime() - b.scheduledTime.getTime();
    });
  }

  /**
   * Get dial queue statistics
   */
  getDialQueueStats(): DialQueueStats {
    const total = this.dialQueue.length;
    const pending = this.dialQueue.filter(e => e.status === 'pending').length;
    const completed = this.dialQueue.filter(e => e.status === 'completed').length;
    const failed = this.dialQueue.filter(e => e.status === 'failed').length;
    const highPriority = this.dialQueue.filter(e => e.priority === 'high' && e.status === 'pending').length;

    return { total, pending, completed, failed, highPriority };
  }
}

interface DialEntry {
  id: string;
  phoneNumber: string;
  contactName: string;
  purpose: string;
  priority: 'high' | 'medium' | 'low';
  scheduledTime: Date;
  attempts: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  lastAttempt?: Date;
  notes?: string;
}

type DialOutcome = 'completed' | 'no-answer' | 'busy' | 'voicemail';

interface DialQueueStats {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  highPriority: number;
}