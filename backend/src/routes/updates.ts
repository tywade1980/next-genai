import { Router } from 'express';
import { UpdateCheckRequest, UpdateCheckResponse } from '@next-genai/shared';

const router = Router();

// In a real implementation, this would check a database or version management system
const APP_VERSIONS = {
  web: { version: '1.0.0', downloadUrl: undefined, isRequired: false },
  android: { version: '1.0.0', downloadUrl: '/downloads/app-release.apk', isRequired: false },
  ios: { version: '1.0.0', downloadUrl: undefined, isRequired: false },
};

router.post('/check', async (req, res) => {
  try {
    const { platform, currentVersion }: UpdateCheckRequest = req.body;

    if (!platform || !currentVersion) {
      return res.status(400).json({
        success: false,
        error: 'Platform and current version are required',
      });
    }

    const latestVersion = APP_VERSIONS[platform];
    if (!latestVersion) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported platform',
      });
    }

    const hasUpdate = compareVersions(currentVersion, latestVersion.version) < 0;

    const response: UpdateCheckResponse = {
      hasUpdate,
      latestVersion: hasUpdate ? {
        version: latestVersion.version,
        platform,
        releaseDate: new Date(),
        features: ['Bug fixes and performance improvements'],
        bugFixes: ['Fixed sync issues', 'Improved call quality'],
        isRequired: latestVersion.isRequired,
        downloadUrl: latestVersion.downloadUrl,
      } : undefined,
      isRequired: hasUpdate ? latestVersion.isRequired : false,
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Update check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check for updates',
    });
  }
});

// Utility function to compare versions
function compareVersions(version1: string, version2: string): number {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  const maxLength = Math.max(v1parts.length, v2parts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part < v2part) return -1;
    if (v1part > v2part) return 1;
  }
  
  return 0;
}

export default router;