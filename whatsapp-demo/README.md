# WhatsApp API Demo - Meta WhatsApp Business API Wrapper

A Spring Boot wrapper API for Meta's WhatsApp Business API that allows you to send WhatsApp messages programmatically.

## Features

- Send text messages to WhatsApp users
- Send template messages (hello_world and custom templates)
- Support for Meta WhatsApp Business API standard format
- Webhook support for receiving message status updates
- Health check endpoints
- Comprehensive error handling
- Reactive programming with WebFlux

## Prerequisites

1. Meta Developer Account
2. WhatsApp Business API setup
3. Phone Number ID
4. Access Token
5. Java 17 or later
6. Maven

## Setup Instructions

### 1. Configure Meta WhatsApp Credentials

Edit the `application.properties` file and replace the placeholders with your actual values:

```properties
meta.whatsapp.phone-number-id=YOUR_PHONE_NUMBER_ID
meta.whatsapp.access-token=YOUR_ACCESS_TOKEN
meta.whatsapp.webhook-verify-token=YOUR_WEBHOOK_VERIFY_TOKEN
```

### 2. Build and Run the Application

```bash
cd whatsapp-demo
mvn clean install
mvn spring-boot:run
```

The application will start on port `8081` with context path `/whatsapp-api`.

Base URL: `http://localhost:8081/whatsapp-api`

## API Endpoints

### 1. Send WhatsApp Text Message

**Endpoint:** `POST /api/v1/whatsapp/send-message`

**Request Body (Text Message):**
```json
{
    "to": "1234567890",
    "type": "text",
    "message": "Hello from WhatsApp API!"
}
```

**Request Body (Template Message):**
```json
{
    "to": "1234567890",
    "type": "template",
    "template": {
        "name": "hello_world",
        "language": {
            "code": "en_US"
        }
    }
}
```

**Response:**
```json
{
    "success": true,
    "messageId": "wamid.HBgMOTE5ODI...",
    "status": "sent",
    "to": "1234567890"
}
```

### 2. Send Template Message (Simple)

**Endpoint:** `POST /api/v1/whatsapp/send-template?to=1234567890&templateName=hello_world&languageCode=en_US`

### 3. Health Check

**Endpoint:** `GET /api/v1/whatsapp/health`

### 4. Service Status

**Endpoint:** `GET /api/v1/whatsapp/status`

### 5. Webhook Verification

**Endpoint:** `GET /api/v1/whatsapp/webhook`

## cURL Examples

### Send a Text Message

```bash
curl -X POST http://localhost:8081/whatsapp-api/api/v1/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890",
    "type": "text",
    "message": "Hello! This is a test message from the WhatsApp API wrapper."
  }'
```

### Send a Template Message (hello_world)

```bash
curl -X POST http://localhost:8081/whatsapp-api/api/v1/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "1234567890",
    "type": "template",
    "template": {
        "name": "hello_world",
        "language": {
            "code": "en_US"
        }
    }
  }'
```

### Send Template Message (Simple API)

```bash
curl -X POST "http://localhost:8081/whatsapp-api/api/v1/whatsapp/send-template?to=1234567890&templateName=hello_world&languageCode=en_US"
```

### Health Check

```bash
curl -X GET http://localhost:8081/whatsapp-api/api/v1/whatsapp/health
```

### Service Status

```bash
curl -X GET http://localhost:8081/whatsapp-api/api/v1/whatsapp/status
```

### Examples for Different Countries

```bash
# Send text message to Indian number
curl -X POST http://localhost:8081/whatsapp-api/api/v1/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "919876543210",
    "type": "text",
    "message": "नमस्ते! यह WhatsApp API का परीक्षण संदेश है।"
  }'

# Send template message to US number
curl -X POST http://localhost:8081/whatsapp-api/api/v1/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "15551234567",
    "type": "template",
    "template": {
        "name": "hello_world",
        "language": {
            "code": "en_US"
        }
    }
  }'

# Send template with Spanish language
curl -X POST http://localhost:8081/whatsapp-api/api/v1/whatsapp/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "525512345678",
    "type": "template",
    "template": {
        "name": "hello_world",
        "language": {
            "code": "es"
        }
    }
  }'
```

## Configuration Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `meta.whatsapp.phone-number-id` | Your WhatsApp Phone Number ID | `1234567890123456` |
| `meta.whatsapp.access-token` | Meta Graph API Access Token | `EAAF...` |
| `meta.whatsapp.api-url` | Meta Graph API Base URL | `https://graph.facebook.com/v22.0` |
| `meta.whatsapp.webhook-verify-token` | Webhook Verification Token | `your-verify-token` |

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid phone number or message format
- **401 Unauthorized**: Invalid access token
- **500 Internal Server Error**: Configuration issues or API failures

Example error response:
```json
{
    "success": false,
    "status": "failed",
    "errorMessage": "API Error: 401 - Invalid access token",
    "to": "1234567890"
}
```

## Message Types Supported

### 1. Text Messages
Standard text messages with custom content.

```json
{
    "to": "1234567890",
    "type": "text",
    "message": "Your custom message here"
}
```

### 2. Template Messages
Pre-approved template messages from Meta Business Manager.

```json
{
    "to": "1234567890",
    "type": "template",
    "template": {
        "name": "hello_world",
        "language": {
            "code": "en_US"
        }
    }
}
```

**Supported Language Codes:**
- `en_US` - English (US)
- `es` - Spanish
- `pt_BR` - Portuguese (Brazil)
- `hi` - Hindi
- `ar` - Arabic
- And more based on your Meta template approvals

## Important Notes

1. **Phone Number Format**: Use international format without '+' sign (e.g., `919876543210` for India)
2. **Template Messages**: Templates must be pre-approved in Meta Business Manager
3. **Rate Limits**: Meta WhatsApp API has rate limits. Check your usage.
4. **Webhook URL**: For production, configure webhook URL in Meta Developer Console
5. **Security**: Store access tokens securely, preferably in environment variables
6. **Message Types**: The API follows Meta's standard payload format exactly

## Troubleshooting

1. **Configuration Issues**: Verify all Meta WhatsApp credentials
2. **Network Issues**: Ensure internet connectivity to graph.facebook.com
3. **Phone Number**: Verify the recipient's phone number is registered with WhatsApp
4. **Logs**: Check application logs for detailed error information

## Next Steps

- Add support for media messages (images, documents)
- Implement message templates
- Add message encryption
- Create a web UI for sending messages
- Add database integration for message history