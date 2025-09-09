# Next Gen AI - Smart Construction Business Assistant

Native Android application combining intelligent call management with comprehensive construction business management tools.

## Features

### 🤖 AI-Powered Call Management
- **Smart Call Screening**: AI-powered spam detection and call analysis
- **Intelligent Receptionist**: Automated call handling with natural language processing
- **Real-time Transcription**: Live call transcription and smart note-taking
- **Call Analytics**: Advanced insights and sentiment analysis

### 🏗️ Construction Business Management System (CBMS)
- **Project Management**: Track construction projects from planning to completion
- **Client Management**: Comprehensive client database with communication history
- **Estimate Generation**: AI-assisted estimate creation and management
- **Task Tracking**: Project task management with automated reminders
- **Material Management**: Inventory tracking and cost management
- **Call Integration**: Seamless integration of call data with business operations

### 🧠 Three Specialized AI Models
1. **Call Analysis Model**: Spam detection, intent recognition, and caller analysis
2. **Business Intelligence Model**: Project insights, cost analysis, and workflow optimization
3. **Transcription & NLP Model**: Real-time speech-to-text and natural language processing

## Technology Stack

- **Language**: Kotlin 1.9.25
- **Platform**: Android SDK 35 (API Level 35)
- **JDK**: OpenJDK 21
- **Architecture**: MVVM with Clean Architecture
- **UI Framework**: Jetpack Compose
- **Database**: Room (SQLite)
- **Dependency Injection**: Dagger Hilt
- **Networking**: Retrofit + OkHttp
- **AI Integration**: Google Generative AI, TensorFlow Lite
- **Build System**: Gradle 8.7

## Prerequisites

- Android Studio Hedgehog or later
- JDK 21
- Android SDK 35
- Minimum Android version: API 24 (Android 7.0)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/tywade1980/next-genai.git
   cd next-genai
   ```

2. **Configure API Keys**
   - Add your Google Generative AI API key to the secure configuration
   - Update telephony service configurations as needed

3. **Build the project**
   ```bash
   ./gradlew build
   ```

4. **Install on device**
   ```bash
   ./gradlew installDebug
   ```

## Permissions Required

- `CALL_PHONE`: Making calls through the app
- `READ_PHONE_STATE`: Call state monitoring
- `ANSWER_PHONE_CALLS`: Smart call handling
- `READ_CALL_LOG` / `WRITE_CALL_LOG`: Call history integration
- `READ_CONTACTS` / `WRITE_CONTACTS`: Contact management
- `RECORD_AUDIO`: Call transcription
- `INTERNET`: AI model communication
- `POST_NOTIFICATIONS`: Call and business notifications

## Project Structure

```
app/src/main/kotlin/com/nextgenai/
├── ai/                    # AI models and processing
├── cbms/                  # Construction Business Management
│   ├── domain/           # Business entities and models
│   ├── data/             # Data repositories and sources
│   └── presentation/     # UI components and ViewModels
├── telephony/            # Call screening and management services
├── data/                 # Database, DAOs, and converters
├── presentation/         # Main UI components and themes
└── NextGenAIApplication.kt
```

## Key Components

### Call Management
- `CallScreeningService`: Intelligent call screening and spam detection
- `InCallService`: Real-time call features and transcription
- `ConnectionService`: Smart dialing and connection management

### Business Management
- **Projects**: Full lifecycle project management
- **Clients**: Customer relationship management
- **Estimates**: AI-assisted proposal generation
- **Tasks**: Project task tracking and automation
- **Materials**: Inventory and cost management

### AI Integration
- **AIModelManager**: Centralized AI model management
- **Call Analysis**: Real-time call intelligence
- **Business Insights**: Project and cost optimization
- **Transcription**: Speech-to-text and NLP processing

## Development

### Build Commands
```bash
# Debug build
./gradlew assembleDebug

# Release build
./gradlew assembleRelease

# Run tests
./gradlew test

# Run lint
./gradlew lint
```

### Code Style
- Kotlin official code style
- Material Design 3 guidelines
- Clean Architecture principles
- SOLID design patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is proprietary software. All rights reserved.

## Support

For support and questions, please contact: [support@nextgenai.com]

---

**Next Gen AI** - Revolutionizing construction business management through intelligent call handling and AI-powered insights.
