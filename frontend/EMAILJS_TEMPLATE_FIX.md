# 📧 EmailJS Template Configuration Guide

## Issue: Email not showing proper data (name, email, subject, message)

### ✅ Solution: Update EmailJS Template Variables

## Step 1: Go to EmailJS Dashboard
1. Visit: https://dashboard.emailjs.com/admin
2. Go to **Email Templates** section
3. Select your template (or create new one)

---

## Step 2: Use This Exact Template

### Template Subject Line:
```
New Contact Message: {{subject}}
```

### Template Body (HTML):
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }
        .field {
            margin-bottom: 20px;
        }
        .label {
            font-weight: bold;
            color: #667eea;
            display: block;
            margin-bottom: 5px;
        }
        .value {
            background: white;
            padding: 10px;
            border-radius: 5px;
            border-left: 3px solid #667eea;
        }
        .message-box {
            background: white;
            padding: 15px;
            border-radius: 5px;
            border: 1px solid #ddd;
            min-height: 100px;
        }
        .footer {
            background: #333;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 0 0 10px 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 New Contact Form Submission</h2>
            <p>Crime Portal Support System</p>
        </div>
        
        <div class="content">
            <div class="field">
                <span class="label">👤 From:</span>
                <div class="value">{{from_name}}</div>
            </div>
            
            <div class="field">
                <span class="label">📧 Email:</span>
                <div class="value">{{from_email}}</div>
            </div>
            
            <div class="field">
                <span class="label">📋 Subject:</span>
                <div class="value">{{subject}}</div>
            </div>
            
            <div class="field">
                <span class="label">💬 Message:</span>
                <div class="message-box">{{message}}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>This email was sent from Crime Portal Contact Form</p>
            <p>Reply to: {{from_email}}</p>
        </div>
    </div>
</body>
</html>
```

---

## Step 3: Plain Text Version (Auto-Reply Section)

```
New Contact Form Submission
Crime Portal Support System

From: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
This email was sent from Crime Portal Contact Form
Reply to: {{from_email}}
```

---

## Step 4: Variable Mapping (IMPORTANT!)

Make sure these variables are in your template:

| Variable in Template | Data from Form | Description |
|---------------------|----------------|-------------|
| `{{from_name}}`     | formData.name  | Sender's name |
| `{{from_email}}`    | formData.email | Sender's email |
| `{{subject}}`       | formData.subject | Email subject |
| `{{message}}`       | formData.message | Message content |
| `{{to_name}}`       | "Crime Portal Team" | Your team name (optional) |

---

## Step 5: Test Settings in EmailJS

### Email Service Settings:
1. Make sure Gmail/Outlook is connected
2. Check "From Name": Crime Portal Support
3. Check "From Email": Your verified email
4. Check "Reply To": {{from_email}} (important!)

### Template Settings:
1. Click "Test It" button
2. Fill sample data:
   ```
   from_name: John Doe
   from_email: john@example.com
   subject: Test Message
   message: This is a test message
   ```
3. Send test email
4. Check your inbox!

---

## Step 6: Verify Code Matches

Your Contact.js and Support.js should have this exact code:

```javascript
const result = await emailjs.send(
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID,
  {
    from_name: formData.name,      // ← Maps to {{from_name}}
    from_email: formData.email,    // ← Maps to {{from_email}}
    subject: formData.subject,     // ← Maps to {{subject}}
    message: formData.message,     // ← Maps to {{message}}
    to_name: 'Crime Portal Team',  // ← Optional
  },
  EMAILJS_PUBLIC_KEY
);
```

✅ Variable names MUST match exactly (case-sensitive)!

---

## Common Issues & Fixes

### Issue 1: Variables show as {{from_name}} in email
**Fix:** Template variables don't match code. Use exact names above.

### Issue 2: Email empty or missing data
**Fix:** Check Template ID is correct in .env file

### Issue 3: Email not received
**Fix:** 
- Check spam folder
- Verify email service is connected
- Check EmailJS dashboard logs
- Test with "Test It" button first

### Issue 4: "Reply To" not working
**Fix:** In template settings, set Reply-To field to: `{{from_email}}`

---

## Quick Test Checklist

- [ ] Template created in EmailJS dashboard
- [ ] Subject line uses {{subject}}
- [ ] Body uses {{from_name}}, {{from_email}}, {{message}}
- [ ] Template ID copied to .env file
- [ ] Service ID correct in .env file
- [ ] Public Key correct in .env file
- [ ] Test email sent from dashboard
- [ ] Test email sent from Contact/Support page
- [ ] Email received with proper data
- [ ] Reply-To works

---

## Alternative: Simple Template (If having issues)

**Subject:**
```
Contact Form: {{subject}}
```

**Body (Plain Text):**
```
You received a new message from Crime Portal Contact Form

Name: {{from_name}}
Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}

---
Reply directly to this email to respond to {{from_name}}
```

---

## Debug Steps

1. **Console Check:**
```javascript
console.log('Sending email with data:', {
  from_name: formData.name,
  from_email: formData.email,
  subject: formData.subject,
  message: formData.message,
});
```

2. **EmailJS Dashboard:**
   - Go to: https://dashboard.emailjs.com/admin/logs
   - Check recent emails sent
   - See what data was received
   - Check error messages

3. **Test Email First:**
   - Use "Test It" button in template
   - Fill all fields manually
   - Verify email format looks good
   - Then use from website

---

## Pro Tips

✅ **Use HTML template** for better formatting
✅ **Add Reply-To field** so you can respond easily
✅ **Test with dummy data** first
✅ **Check spam folder** initially
✅ **Copy variable names exactly** from this guide
✅ **Don't use special characters** in variable names

---

**After updating template, wait 2-3 minutes for changes to sync, then test again!** 🚀
