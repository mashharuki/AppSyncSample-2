# Authentication System

This project implements user authentication using AWS Cognito with full integration into the AppSync GraphQL API and Next.js frontend.

## Backend (CDK)

### Cognito User Pool
**Location**: `pkgs/cdk/lib/cdk-appsync-demo-stack.ts`

**Configuration**:
- User Pool Name: `appsync-sample-user-pool`
- Sign-in Method: Email address
- Self Sign-up: Enabled
- Email Verification: Required (verification code)
- Password Policy:
  - Minimum length: 8 characters
  - Requires: lowercase, uppercase, numbers
  - Does NOT require: special characters
- Account Recovery: Email only
- Removal Policy: DESTROY (for development)

### Cognito User Pool Client
**Configuration**:
- Client Name: `appsync-sample-web-client`
- Auth Flows:
  - USER_PASSWORD_AUTH: Enabled
  - USER_SRP_AUTH: Enabled (Secure Remote Password)
  - REFRESH_TOKEN_AUTH: Enabled
- OAuth Settings:
  - Flows: Authorization Code Grant
  - Scopes: email, openid, profile
- Token Validity:
  - Access Token: 1 hour (60 minutes)
  - ID Token: 1 hour (60 minutes)
  - Refresh Token: 30 days (43200 minutes)

### AppSync Authentication
**Location**: `pkgs/cdk/lib/cdk-appsync-demo-stack.ts`

**Default Authorization**: Cognito User Pool
**Additional Authorization Modes**:
- API_KEY (for backward compatibility)
- IAM (for AWS service access)

This allows gradual migration from API_KEY to Cognito authentication.

### CloudFormation Outputs
The following Cognito-related values are exported:
- `UserPoolId`: Cognito User Pool ID
- `UserPoolClientId`: User Pool Client ID
- `UserPoolArn`: User Pool ARN

These values are automatically set as environment variables in Amplify Hosting.

## Frontend (Next.js)

### Directory Structure
```
pkgs/frontend/
├── context/
│   └── auth-context.tsx          # Global authentication state
├── lib/
│   ├── amplify-config.ts          # Amplify/Cognito configuration
│   └── graphql-client.ts          # GraphQL client setup
├── app/
│   ├── auth/
│   │   └── page.tsx               # Authentication page
│   ├── components/
│   │   ├── Header.tsx             # Header with user info & logout
│   │   └── ProtectedRoute.tsx    # Route guard component
│   ├── layout.tsx                 # Root layout with AuthProvider
│   └── page.tsx                   # Protected home page
└── middleware.ts                  # Next.js middleware for route protection
```

### Core Components

#### 1. Amplify Configuration
**File**: `pkgs/frontend/lib/amplify-config.ts`

Configures Amplify with Cognito User Pool settings:
- User Pool ID from environment variable
- User Pool Client ID from environment variable
- Login method: Email
- Sign-up verification: Code (sent via email)
- Password requirements matching backend
- GraphQL API default auth mode: `userPool`

#### 2. Authentication Context
**File**: `pkgs/frontend/context/auth-context.tsx`

**Exports**:
- `AuthProvider`: React Context Provider for app-wide auth state
- `useAuth()`: Custom hook to access auth state
- `AuthUser` interface: User data type

**State Management**:
- `user`: Current authenticated user (or null)
- `loading`: Authentication check in progress
- `error`: Authentication error (if any)
- `signOut()`: Function to sign out user
- `refreshUser()`: Function to refresh user data

**Behavior**:
- Automatically fetches user on mount
- Handles unauthenticated state gracefully
- Provides global auth state to entire app

#### 3. Authentication Page
**File**: `pkgs/frontend/app/auth/page.tsx`

Uses Amplify UI `Authenticator` component with:
- Japanese-localized form labels
- Custom styling (glass morphism design)
- Sign-up, sign-in, password reset flows
- Email verification flow
- Auto-redirect to `/` on successful authentication

#### 4. Protected Route Component
**File**: `pkgs/frontend/app/components/ProtectedRoute.tsx`

Guards routes requiring authentication:
- Shows loading spinner while checking auth
- Redirects to `/auth` if not authenticated
- Renders children only for authenticated users

#### 5. Header Component
**File**: `pkgs/frontend/app/components/Header.tsx`

Displays:
- App logo and navigation
- User email/username when authenticated
- Logout button when authenticated
- Login button when not authenticated

#### 6. Route Protection Middleware
**File**: `pkgs/frontend/middleware.ts`

Next.js middleware for server-side route protection:
- Applies to all routes except `/auth`, static files, API routes
- First line of defense (client-side checks in ProtectedRoute)

### Authentication Flows

#### Sign-up Flow
1. User visits `/auth`
2. Enters email and password
3. Cognito sends verification code to email
4. User enters verification code
5. Account activated
6. Auto-redirect to `/` (home page)

#### Sign-in Flow
1. User visits `/auth`
2. Enters email and password
3. Cognito validates credentials
4. Auth tokens stored securely
5. Auto-redirect to `/` (home page)
6. Header displays user info

#### Password Reset Flow
1. User clicks "Forgot password" on `/auth`
2. Enters email address
3. Cognito sends verification code to email
4. User enters code and new password
5. Password updated
6. User can sign in with new password

#### Sign-out Flow
1. User clicks logout button in Header
2. `signOut()` called from AuthContext
3. Cognito session cleared
4. User state set to null
5. Auto-redirect to `/auth`

### GraphQL Integration

**Authentication Mode**: `userPool` (default)

When a user is authenticated:
- Amplify automatically attaches Cognito tokens to GraphQL requests
- AppSync validates the token
- Only authenticated users can access GraphQL API
- User identity available in resolvers (if needed for authorization logic)

### Environment Variables

**Required** (set in `.env.local` after CDK deployment):
```
NEXT_PUBLIC_USER_POOL_ID=ap-northeast-1_xxxxxxxxx
NEXT_PUBLIC_USER_POOL_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APPSYNC_ENDPOINT=https://xxxxx.appsync-api.ap-northeast-1.amazonaws.com/graphql
NEXT_PUBLIC_AWS_REGION=ap-northeast-1
```

For Amplify Hosting, these are set automatically from CDK outputs.

## Testing

### Backend Tests
**File**: `pkgs/cdk/test/cdk-appsync-demo-stack.test.ts`

Covers:
- Cognito User Pool creation and configuration
- User Pool Client settings
- AppSync authentication modes
- CloudFormation outputs

**Total Tests**: 42 (all passing)

### Frontend Build
All pages compile successfully with TypeScript validation.

## Security Considerations

1. **Password Policy**: Enforced at User Pool level
2. **Token Management**: Handled automatically by Amplify
3. **HTTPS**: Required for production (Amplify Hosting)
4. **Email Verification**: Required before account activation
5. **Token Expiration**: Short-lived access tokens (1 hour)
6. **Refresh Tokens**: Long-lived but revocable (30 days)

## Known Limitations

1. **Static Export**: Middleware warnings due to Next.js static export mode
2. **Social Login**: OAuth configured but providers not set up yet
3. **MFA**: Not enabled (can be added via User Pool settings)
4. **Custom Email**: Using default Cognito email templates

## Future Enhancements

- Add social login providers (Google, Facebook, etc.)
- Enable MFA (Multi-Factor Authentication)
- Customize email templates
- Add user profile management page
- Implement role-based access control (RBAC)
- Add password strength meter
- Implement "Remember Me" functionality
