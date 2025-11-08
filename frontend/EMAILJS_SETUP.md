# 📧 EmailJS Setup Guide for Contact Page

## Quick Setup (5 minutes)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Click "Sign Up" (Free - 200 emails/month)
3. Sign up with Google/GitHub or email

---

### Step 2: Add Email Service
1. Go to **Email Services** tab
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (Recommended)
   - Outlook
   - Yahoo
   - Custom SMTP

#### For Gmail:
1. Select "Gmail"
2. Click "Connect Account"
3. Sign in with your Gmail
4. Allow EmailJS access
5. **Copy the Service ID** (e.g., `service_abc1234`)

---

### Step 3: Create Email Template
1. Go to **Email Templates** tab
2. Click **"Create New Template"**
3. Use this template:

```
Subject: New Contact Form Message - {{subject}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent from Crime Portal Contact Form.
```

4. Click **"Save"**
5. **Copy the Template ID** (e.g., `template_xyz5678`)

---

### Step 4: Get Public Key
1. Go to **Account** → **General**
2. Find **"Public Key"** section
3. **Copy the Public Key** (e.g., `abcDEF123xyz`)

---

### Step 5: Update Contact.js
Open `frontend/src/pages/Contact.js` and replace these lines (around line 33-35):

```javascript
// BEFORE:
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

// AFTER (with your actual values):
const EMAILJS_SERVICE_ID = 'service_abc1234';      // From Step 2
const EMAILJS_TEMPLATE_ID = 'template_xyz5678';    // From Step 3
const EMAILJS_PUBLIC_KEY = 'abcDEF123xyz';         // From Step 4
```

---

### Step 6: Update Contact Info (Optional)
In `Contact.js`, update the contact information (around line 37-51):

```javascript
const contactInfo = [
  {
    icon: <EmailIcon sx={{ fontSize: 40 }} />,
    title: 'Email',
    detail: 'your-actual-email@gmail.com',  // ← Update this
    color: '#1976d2',
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 40 }} />,
    title: 'Phone',
    detail: '+91 XXXXX-XXXXX',              // ← Update this
    color: '#2e7d32',
  },
  {
    icon: <LocationIcon sx={{ fontSize: 40 }} />,
    title: 'Location',
    detail: 'Your College/City, India',     // ← Update this
    color: '#ed6c02',
  },
];
```

---

### Step 7: Test It!
1. Start your frontend: `npm start`
2. Go to: http://localhost:3000/contact
3. Fill the form and click "Send Message"
4. Check your email inbox! 📬

---

## Email Template Variables

Your EmailJS template can use these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{from_name}}` | Sender's name | John Doe |
| `{{from_email}}` | Sender's email | john@example.com |
| `{{subject}}` | Message subject | Bug Report |
| `{{message}}` | Message content | I found a bug... |
| `{{to_name}}` | Your name/team | Crime Portal Team |

---

## Advanced Template Example

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #1976d2; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background: #f5f5f5; padding: 10px; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
        <p><strong>From:</strong> {{from_name}}</p>
        <p><strong>Email:</strong> {{from_email}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>{{message}}</p>
    </div>
    <div class="footer">
        <p>Sent from Crime Portal Contact Form</p>
    </div>
</body>
</html>
```

---

## Troubleshooting

### Issue 1: Emails not sending
**Error:** `Failed to send message`

**Fix:**
- Check Service ID, Template ID, and Public Key are correct
- Verify email service is connected in EmailJS dashboard
- Check browser console for error details

### Issue 2: Service blocked
**Error:** `Service connection failed`

**Fix:**
- Reconnect your Gmail in EmailJS dashboard
- Check if you need to allow "Less secure app access" (Gmail)
- For Gmail with 2FA: Create an App Password

### Issue 3: Template not found
**Error:** `Template not found`

**Fix:**
- Make sure template is saved and active
- Copy the exact Template ID from EmailJS dashboard
- Template variables must match exactly (case-sensitive)

---

## Environment Variables (Optional - for production)

For better security, use environment variables:

1. Create `.env.local` in frontend folder:
```bash
REACT_APP_EMAILJS_SERVICE_ID=service_abc1234
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz5678
REACT_APP_EMAILJS_PUBLIC_KEY=abcDEF123xyz
```

2. Update Contact.js:
```javascript
const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
```

3. For Vercel deployment, add these in Environment Variables section.

---

## Testing Checklist

- [ ] EmailJS account created
- [ ] Email service connected (Gmail)
- [ ] Email template created with variables
- [ ] Service ID, Template ID, Public Key copied
- [ ] Contact.js updated with credentials
- [ ] Contact info updated (email, phone, location)
- [ ] Form validation working
- [ ] Test email sent successfully
- [ ] Email received in inbox
- [ ] Error handling works

---

## Free Tier Limits

EmailJS Free Plan:
- ✅ 200 emails/month
- ✅ 2 email services
- ✅ 2 email templates
- ✅ Basic analytics

If you need more, upgrade to paid plan ($15/month for 1000 emails).

---

## Support

EmailJS Documentation: https://www.emailjs.com/docs/

Need help? Check:
1. EmailJS Dashboard → Logs (see failed emails)
2. Browser Console (F12) for error messages
3. EmailJS Support (support@emailjs.com)

---

**Setup complete! Your contact form is now live! 📧✅**
