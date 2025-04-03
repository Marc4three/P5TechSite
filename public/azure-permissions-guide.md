# Azure AD Permissions Guide

## Fixing the 403 Forbidden Error

If you're seeing a 403 Forbidden error when trying to access Microsoft Graph API resources, it's likely because your Azure AD application doesn't have the necessary permissions. This guide will help you fix this issue.

## Required Permissions

The application needs the following Microsoft Graph API permissions:

1. **User.Read** - To access basic user information
2. **GroupMember.Read.All** - To access group memberships
3. **Group.Read.All** - To access group information
4. **Tasks.Read** - To read Planner tasks
5. **Tasks.ReadWrite** - To create and update Planner tasks

## Step-by-Step Instructions

### 1. Access the Azure Portal

1. Go to the [Azure Portal](https://portal.azure.com)
2. Sign in with your admin account

### 2. Navigate to App Registrations

1. In the left menu, click on "Azure Active Directory"
2. In the Azure Active Directory menu, click on "App registrations"
3. Find your application in the list (look for the client ID: `239638c9-4484-4eab-8820-9f070d2b1998`)

### 3. Add API Permissions

1. Click on your application to open its details
2. In the left menu, click on "API permissions"
3. Click the "Add a permission" button
4. Select "Microsoft Graph" from the list of APIs
5. Choose "Delegated permissions" (not Application permissions)
6. Search for and select the following permissions:
   - User.Read
   - GroupMember.Read.All
   - Group.Read.All
   - Tasks.Read
   - Tasks.ReadWrite
7. Click the "Add permissions" button

### 4. Grant Admin Consent

1. After adding the permissions, click the "Grant admin consent" button
2. Confirm the action when prompted
   - Note: This requires admin privileges. If you don't have admin rights, you'll need to contact your Azure AD administrator.

### 5. Verify Permissions

1. After granting consent, the permissions should show as "Granted for [your tenant]"
2. If any permissions still show as "Not granted", click the "Grant admin consent" button again

## Post-Update Actions

After updating the permissions in Azure AD:

1. Clear your browser cache
2. Sign out of the application
3. Sign back in to get a new token with the updated permissions

## Troubleshooting

If you're still experiencing issues after following these steps:

1. **Check token scopes**: Make sure the application is requesting the correct scopes when acquiring tokens
2. **Verify admin consent**: Ensure admin consent was granted for all required permissions
3. **Check conditional access policies**: Your organization might have conditional access policies that are blocking access
4. **Verify licenses**: Ensure your account has the necessary licenses for Microsoft Planner
5. **Check token expiration**: Tokens might be cached. Try signing out and signing back in
6. **Review error messages**: Check the console for detailed error messages that might provide more information

## Need More Help?

If you're still experiencing issues after following these steps, please contact your Azure AD administrator or Microsoft support. 