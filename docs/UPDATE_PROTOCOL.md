# Update Protocol

This document describes the application update system for Next GenAI web and mobile applications.

## Overview

The update protocol ensures that users receive the latest features, bug fixes, and security updates across all platforms. It includes automatic update checking, version management, and deployment strategies.

## Version Management

### Semantic Versioning
All applications follow semantic versioning (semver):
- **MAJOR.MINOR.PATCH** (e.g., 1.2.3)
- **MAJOR**: Breaking changes or major feature releases
- **MINOR**: New features, backward compatible
- **PATCH**: Bug fixes, backward compatible

### Version Tracking
Each platform maintains its own version:
- Web: Tracked in `web/package.json`
- Mobile: Tracked in `mobile/package.json`
- Backend: Tracked in `backend/package.json`

## Update Checking

### Automatic Check Schedule
- **Web**: Checks on application start and every 24 hours
- **Mobile**: Checks on application start and every 12 hours
- **Manual**: User can trigger update check via settings

### Update Check API

```typescript
POST /updates/check
{
  "platform": "web" | "android" | "ios",
  "currentVersion": "1.0.0"
}

Response:
{
  "hasUpdate": boolean,
  "latestVersion": {
    "version": "1.1.0",
    "platform": "android",
    "releaseDate": "2024-01-15T10:00:00Z",
    "features": ["New AI model integration", "Improved call quality"],
    "bugFixes": ["Fixed sync issues", "Resolved memory leak"],
    "isRequired": false,
    "downloadUrl": "/downloads/app-release-1.1.0.apk"
  },
  "isRequired": false
}
```

## Update Types

### 1. Optional Updates
- New features and enhancements
- Non-critical bug fixes
- Performance improvements
- User can choose when to update

### 2. Required Updates
- Critical security fixes
- Breaking API changes
- Major bug fixes affecting core functionality
- Forces user to update before continuing

### 3. Emergency Updates
- Critical security vulnerabilities
- Data corruption fixes
- Service-breaking issues
- Immediate forced update

## Platform-Specific Updates

### Web Application Updates

#### Automatic Updates
- Next.js automatic code splitting and hot reloading
- Service worker cache invalidation
- Background updates during navigation

#### Update Notification
```typescript
// Update detection
const checkForUpdates = async () => {
  const response = await apiClient.checkForUpdates({
    platform: 'web',
    currentVersion: '1.0.0'
  });
  
  if (response.data?.hasUpdate) {
    showUpdateNotification(response.data.latestVersion);
  }
};

// Update notification component
const UpdateNotification = ({ version, isRequired }) => (
  <div className="update-banner">
    <p>New version {version.version} available!</p>
    <button onClick={() => window.location.reload()}>
      {isRequired ? 'Update Required' : 'Update Now'}
    </button>
  </div>
);
```

### Mobile Application Updates

#### APK Distribution
- Self-hosted APK files on the backend server
- Direct download links provided via update API
- Version-specific APK naming: `app-release-{version}.apk`

#### Update Flow
1. App checks for updates on startup
2. If update available, show notification
3. User taps update → download APK
4. Installation prompt via Android package installer
5. App restart with new version

#### Implementation
```typescript
// Mobile update check
const checkMobileUpdates = async () => {
  const response = await apiClient.checkForUpdates({
    platform: 'android',
    currentVersion: getCurrentVersion()
  });
  
  if (response.data?.hasUpdate) {
    Alert.alert(
      'Update Available',
      `Version ${response.data.latestVersion.version} is available`,
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Update', onPress: () => downloadUpdate(response.data.latestVersion) }
      ]
    );
  }
};

// APK download and installation
const downloadUpdate = async (version) => {
  try {
    const downloadUrl = `${API_BASE_URL}${version.downloadUrl}`;
    // Use React Native file download library
    const result = await downloadFile(downloadUrl);
    
    // Open Android package installer
    await openApkInstaller(result.path);
  } catch (error) {
    Alert.alert('Update Failed', error.message);
  }
};
```

## Update Deployment

### Backend Updates
- Rolling deployment with zero downtime
- Database migration scripts
- Backward compatibility during transition
- Health checks and rollback capability

### Web Updates
- Automated deployment to CDN/hosting service
- Cache invalidation for immediate availability
- Progressive web app update notifications
- Fallback to previous version if errors detected

### Mobile Updates
- APK build and signing process
- Upload to backend download directory
- Update database with new version information
- QA testing before marking as available

## Update Configuration

### Backend Configuration
```typescript
// Update settings in backend
const APP_VERSIONS = {
  web: {
    version: '1.0.0',
    downloadUrl: null,
    isRequired: false,
    features: ['Initial release'],
    bugFixes: []
  },
  android: {
    version: '1.0.0', 
    downloadUrl: '/downloads/app-release-1.0.0.apk',
    isRequired: false,
    features: ['Initial mobile release'],
    bugFixes: []
  }
};
```

### Version Release Process
1. **Development**: Code changes and testing
2. **Version Bump**: Update package.json versions
3. **Build**: Generate production builds
4. **QA Testing**: Validate new version functionality
5. **Deploy**: Update backend version configuration
6. **Announce**: Notify users of available update

## Security Considerations

### APK Security
- Code signing with release certificates
- Checksum verification for downloads
- HTTPS-only download links
- Malware scanning before distribution

### Update Verification
- Digital signatures for all updates
- Version integrity checks
- Secure download channels
- User consent for installations

## Monitoring & Analytics

### Update Metrics
- Update adoption rates by platform
- Time between release and installation
- Update failure rates and reasons
- User feedback on new versions

### Logging
```typescript
// Update event logging
const logUpdateEvent = (event, data) => {
  analytics.track('app_update', {
    event,  // 'check', 'download', 'install', 'complete'
    platform: 'android',
    fromVersion: '1.0.0',
    toVersion: '1.1.0',
    isRequired: false,
    ...data
  });
};
```

## Error Handling

### Common Update Errors
- **Network Failures**: Retry with exponential backoff
- **Storage Issues**: Clear cache and retry
- **Installation Failures**: Provide manual download option
- **Version Conflicts**: Force refresh and re-check

### Fallback Strategies
- **Gradual Rollout**: Release to percentage of users first
- **Rollback Plan**: Quick revert to previous version
- **Alternative Channels**: Backup download sources
- **Support Contact**: User can report update issues

## Testing Strategy

### Update Testing
- **Automated Tests**: Version checking logic
- **Integration Tests**: End-to-end update flow
- **Device Testing**: Multiple Android versions and devices
- **Network Testing**: Poor connectivity scenarios

### QA Checklist
- [ ] Version detection works correctly
- [ ] Download progress indicator functions
- [ ] Installation completes successfully
- [ ] App launches with new version
- [ ] Data migration (if required) succeeds
- [ ] All features work in updated version

## Future Enhancements

### Planned Improvements
- **Delta Updates**: Only download changed files
- **Background Updates**: Install while app is running
- **A/B Testing**: Feature flags for gradual rollouts
- **Auto-Update**: Optional automatic installation
- **Update Scheduling**: User-defined update windows

### iOS Support
When iOS version is developed:
- App Store distribution and review process
- TestFlight for beta testing
- iOS-specific update checking
- App Store Connect API integration

This update protocol ensures users always have access to the latest, most secure version of Next GenAI while providing flexibility in how and when updates are applied.