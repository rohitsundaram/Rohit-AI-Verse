# Custom Domain Setup Guide

This guide covers how to add your custom domain (`rohitsundaram.com` or `rohit.ai`) to different hosting platforms.

---

## 🌐 Option 1: Vercel (Recommended - Easiest)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `rohitsundaram/rohits-ai-verse` repository
4. Click "Deploy" (Vercel auto-detects Vite settings)
5. Wait for deployment (~1 minute)

### Step 2: Add Custom Domain
1. Go to your project dashboard on Vercel
2. Click **Settings** → **Domains**
3. Enter your domain: `rohitsundaram.com` (or `rohit.ai`)
4. Click "Add"
5. Vercel will show you DNS records to configure

### Step 3: Configure DNS (at your domain registrar)
Vercel will provide you with specific DNS records. Typically:

**Option A - Use CNAME (Recommended):**
- Type: `CNAME`
- Name: `@` or root domain
- Value: `cname.vercel-dns.com.` (or what Vercel provides)
- TTL: 3600

**Option B - Use A Records:**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (or values provided by Vercel)
- TTL: 3600

**For www subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com.` (or what Vercel provides)

### Step 4: Wait for DNS Propagation
- Usually takes 5 minutes to 48 hours
- Vercel will show "Valid Configuration" when ready
- Your site will automatically get HTTPS certificate

**✅ Done!** Your site will be live at `https://rohitsundaram.com`

---

## 🌐 Option 2: Netlify

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and sign in with GitHub
2. Click "Add new site" → "Import an existing project"
3. Select your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click "Deploy site"

### Step 2: Add Custom Domain
1. Go to **Site settings** → **Domain management**
2. Click "Add custom domain"
3. Enter: `rohitsundaram.com`
4. Click "Verify"
5. Netlify will provide DNS instructions

### Step 3: Configure DNS
Follow Netlify's provided DNS records (usually similar to Vercel)

---

## 🌐 Option 3: AWS (S3 + CloudFront)

### Step 1: Deploy to S3
1. Build your site: `npm run build`
2. Create S3 bucket (make it public)
3. Upload `dist/` folder contents to S3
4. Enable static website hosting

### Step 2: Set up CloudFront
1. Create CloudFront distribution
2. Point to your S3 bucket
3. Request SSL certificate in AWS Certificate Manager (ACM)
4. Add your domain: `rohitsundaram.com` and `*.rohitsundaram.com`

### Step 3: Configure DNS (Route 53)
1. Create hosted zone for `rohitsundaram.com`
2. Add A record (alias) pointing to CloudFront distribution
3. Wait for DNS propagation

---

## 🌐 Option 4: Cloudflare Pages

### Step 1: Deploy
1. Connect GitHub repo to Cloudflare Pages
2. Build command: `npm run build`
3. Build output directory: `dist`

### Step 2: Add Custom Domain
1. Go to **Custom domains** in your Pages project
2. Add domain: `rohitsundaram.com`
3. Configure DNS in Cloudflare (or your registrar)
4. Cloudflare provides DNS records automatically

---

## 📋 General DNS Configuration Tips

### Where to configure DNS:
- Go to your domain registrar (where you bought the domain)
- Examples: GoDaddy, Namecheap, Google Domains, Cloudflare, Route 53
- Look for "DNS Management" or "DNS Settings"

### Common DNS Record Types:
1. **A Record**: Points to an IP address (IPv4)
2. **AAAA Record**: Points to an IPv6 address
3. **CNAME Record**: Points to another domain name
4. **TXT Record**: For verification (hosting providers may require)

### DNS Propagation:
- Changes can take 5 minutes to 48 hours
- Use [dnschecker.org](https://dnschecker.org) to check propagation
- Most changes take effect within 1-2 hours

---

## 🔒 SSL/HTTPS Certificate

Most modern hosting platforms provide **free SSL certificates automatically**:
- ✅ Vercel - Automatic
- ✅ Netlify - Automatic
- ✅ Cloudflare Pages - Automatic
- ✅ AWS CloudFront - Via ACM (free)

You don't need to manually configure SSL on most platforms.

---

## 🧪 Testing Your Domain

After setup, test:
1. `http://rohitsundaram.com` (should redirect to HTTPS)
2. `https://rohitsundaram.com` (should show your site)
3. `https://www.rohitsundaram.com` (should also work)

---

## ❓ Troubleshooting

### Domain not resolving?
- Check DNS records are correct
- Wait longer (DNS can take up to 48 hours)
- Verify with `dig rohitsundaram.com` or `nslookup rohitsundaram.com`

### SSL certificate issues?
- Most platforms auto-renew, but can take a few hours
- Ensure DNS is pointing correctly
- Contact your hosting provider support

### Mixed content warnings?
- Ensure all resources use HTTPS (check browser console)
- Update any hardcoded HTTP URLs in your code

---

## 📝 Next Steps After Domain Setup

1. Update your HTML meta tags (og:url, canonical links)
2. Update your Formspree contact form if needed
3. Test all links and forms
4. Set up redirects (www to non-www or vice versa)

---

Need help with a specific platform? Let me know which one you're using!


