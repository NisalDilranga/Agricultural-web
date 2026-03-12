import emailjs from '@emailjs/browser';

// ─── EmailJS Configuration ────────────────────────────────────────────────────
// Replace these with your real EmailJS credentials from https://emailjs.com
const EMAILJS_SERVICE_ID = 'service_ft7h5vd';
const EMAILJS_PUBLIC_KEY = 'RBbIDF9W6HXh8XpqB';

// Template IDs – create one template per email type in EmailJS dashboard
const TEMPLATES = {
    approved: 'template_3z7j8s9',
    rejected: 'template_4f3yerj',
    pending: '',   // no email sent for pending
};

/**
 * Sends a status-update email to the applicant.
 *
 * @param {Object} app        - The application object from Firestore
 * @param {string} newStatus  - 'approved' | 'rejected' | 'pending'
 * @returns {Promise<void>}
 */
export async function sendStatusEmail(app, newStatus) {
    const templateId = TEMPLATES[newStatus];
    if (!templateId || templateId.startsWith('YOUR_')) {
        console.warn('EmailJS: template ID not configured for status:', newStatus);
        return;
    }

    // These variable names must match the {{variables}} in your EmailJS templates
    const templateParams = {
        to_name: app.name,
        to_email: app.email,
        course_name: app.courseName,
        status: newStatus,
        app_id: app.id,
    };

    await emailjs.send(
        EMAILJS_SERVICE_ID,
        templateId,
        templateParams,
        EMAILJS_PUBLIC_KEY,
    );
}
