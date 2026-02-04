# Golden Passage - Admin Manual

## Overview

This manual provides instructions for administrators managing the Golden Passage trading platform.

## Table of Contents
1. [Admin Dashboard](#admin-dashboard)
2. [User Management](#user-management)
3. [Subscription Management](#subscription-management)
4. [Content Management](#content-management)
5. [System Monitoring](#system-monitoring)
6. [Security](#security)

## Admin Dashboard

### Accessing the Admin Panel

1. Log in with your admin account
2. Navigate to `/admin` or click "Admin Panel" in the user menu
3. You'll see the admin dashboard with key metrics

### Dashboard Metrics

- **Total Users**: All registered users
- **Active Subscribers**: Users with active subscriptions
- **Trial Users**: Users currently on trial
- **Monthly Revenue**: Total revenue this month
- **New Users (30d)**: Users registered in last 30 days
- **Total Trades**: All trades recorded
- **Recent Activity**: Latest user actions

## User Management

### Viewing Users

1. Go to Admin > Users
2. Use filters to find specific users:
   - Search by email/name
   - Filter by subscription status
   - Filter by registration date

### User Actions

#### View User Details
1. Click on a user's email
2. See:
   - Profile information
   - Subscription details
   - Trading statistics
   - Payment history

#### Edit User
1. Click "Edit" on user row
2. Modify:
   - Role (user, admin, superadmin)
   - Subscription status
   - Account status (active/inactive)

#### Deactivate User
1. Click "Deactivate" 
2. Confirm action
3. User can no longer log in
4. Data is preserved

#### Delete User
⚠️ **Warning**: This permanently deletes the user and all their data.

### Bulk Actions

Select multiple users to:
- Send email
- Export data
- Change status

## Subscription Management

### Viewing Subscriptions

1. Go to Admin > Subscriptions
2. See all active, cancelled, and expired subscriptions

### Managing Subscriptions

#### Extend Subscription
1. Find the subscription
2. Click "Extend"
3. Enter new end date
4. Confirm

#### Cancel Subscription
1. Find the subscription
2. Click "Cancel"
3. Choose:
   - Immediate cancellation
   - Cancel at period end
4. Confirm

#### Refund Payment
1. Go to Payments
2. Find the payment
3. Click "Refund"
4. Enter refund amount
5. Confirm

### Promotional Codes

#### Create Promo Code
1. Go to Admin > Promotions
2. Click "New Promo Code"
3. Configure:
   - Code (e.g., SUMMER50)
   - Discount type (percentage/fixed)
   - Discount amount
   - Valid dates
   - Usage limit
4. Save

## Content Management

### Strategies

#### Add Predefined Strategy
1. Go to Admin > Strategies
2. Click "New Strategy"
3. Fill in:
   - Name
   - Description
   - Category
   - Entry rules
   - Exit rules
   - Risk management rules
   - Recommended instruments
   - Timeframes
4. Save

#### Edit Strategy
1. Find the strategy
2. Click "Edit"
3. Make changes
4. Save

### Lessons

#### Add Lesson
1. Go to Admin > Lessons
2. Click "New Lesson"
3. Fill in:
   - Title
   - Description
   - Category
   - Difficulty level
   - Content (supports Markdown)
   - Video URL (optional)
   - Quiz questions (optional)
   - Order number
4. Save

#### Organize Lessons
1. Drag and drop to reorder
2. Create categories
3. Set prerequisites

### Checklists

#### Add Default Checklist
1. Go to Admin > Checklists
2. Click "New Checklist"
3. Configure:
   - Name
   - Type (pre_market, entry, post_market)
   - Items
   - Required/optional status
4. Save

## System Monitoring

### Health Checks

Monitor system health at `/health`:
- Database connection
- Redis connection
- API response time
- Error rates

### Logs

Access logs via:
- Docker: `docker-compose logs -f`
- Cloud provider dashboard
- Log aggregation tool (if configured)

Log levels:
- ERROR: Critical issues
- WARN: Warnings
- INFO: General information
- DEBUG: Detailed debugging

### Performance Metrics

Monitor:
- API response times
- Database query performance
- Cache hit rates
- Error rates

### Alerts

Configure alerts for:
- High error rates
- Database connection failures
- High CPU/memory usage
- Disk space low

## Security

### Admin Access

#### Creating Admin Users
1. Go to Admin > Users
2. Find the user
3. Change role to "admin" or "superadmin"

#### Admin Roles
- **User**: Regular user access
- **Admin**: Can manage users, content, subscriptions
- **Superadmin**: Full access including system settings

### Security Best Practices

1. **Use Strong Passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols
   - No dictionary words

2. **Enable 2FA**
   - All admins should use 2FA
   - Use authenticator app

3. **Regular Password Changes**
   - Change passwords every 90 days
   - Don't reuse passwords

4. **Audit Logs**
   - Review admin actions regularly
   - Look for suspicious activity

5. **Session Management**
   - Log out when done
   - Don't share accounts

### API Keys Management

Rotate API keys regularly:
1. Azure OpenAI
2. Stripe
3. PayPal
4. SendGrid/Email

### Backup Strategy

#### Database Backups
- Automated daily backups
- Retain 30 days
- Store offsite

#### How to Restore
```bash
# From backup file
docker-compose exec -T postgres psql -U postgres golden_passage < backup_file.sql
```

## Troubleshooting

### Common Issues

#### User Can't Log In
1. Check if account is active
2. Verify email is confirmed
3. Check for IP blocks
4. Reset password if needed

#### Payment Failed
1. Check Stripe/PayPal status
2. Verify webhook configuration
3. Check payment logs
4. Contact payment provider

#### AI Features Not Working
1. Check Azure OpenAI quota
2. Verify API keys
3. Check error logs
4. Test API connection

#### Slow Performance
1. Check database connection pool
2. Monitor Redis cache hit rate
3. Check for slow queries
4. Scale resources if needed

### Emergency Procedures

#### System Down
1. Check status page
2. Review error logs
3. Restart services
4. Contact hosting provider if needed

#### Data Breach
1. Isolate affected systems
2. Notify affected users
3. Change all passwords
4. Review access logs
5. Contact authorities if required

## Reports

### Generating Reports

#### User Report
1. Go to Admin > Reports
2. Select "Users"
3. Choose date range
4. Select fields
5. Export (CSV/Excel)

#### Revenue Report
1. Go to Admin > Reports
2. Select "Revenue"
3. Choose period
4. Group by (day/week/month)
5. Export

#### Trading Activity Report
1. Go to Admin > Reports
2. Select "Trading Activity"
3. Filter by user/date
4. Export

### Scheduled Reports

Set up automatic reports:
1. Go to Admin > Reports > Scheduled
2. Click "New Schedule"
3. Configure:
   - Report type
   - Frequency
   - Recipients
   - Format
4. Save

## Support

### Internal Support
- Slack: #golden-passage-support
- Email: admin-support@goldenpassage.com

### Escalation
1. Level 1: Check documentation
2. Level 2: Contact senior admin
3. Level 3: Contact development team

---

**Document Version**: 1.0  
**Last Updated**: 2024
