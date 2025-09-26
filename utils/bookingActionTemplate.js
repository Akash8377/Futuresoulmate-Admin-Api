// Accept Email Template
const generateAcceptEmailTemplate = (acceptMessage) => {
    const emailContent = `
    <html>
        <body>
            <div style="font-size: 12px; font-family: Arial, sans-serif;">
                <div style="display: flex; background-color: #f0f0f0; justify-content:space-between; align-items: center; font-size: 12px; font-family: Arial, sans-serif;">
                <img src="cid:logo" alt="Logo" style="max-width: 90px; height: auto; padding-top:5px; padding-left:5px">
                    <div style="padding-top:5px; padding-right:5px; line-height: 1;">
                        <p style="margin: 0; padding: 0; font-weight: bold;">Worldwide</p>
                        <p style="margin: 0; padding: 0; font-weight: bold;">Executive Transportation</p>
                    </div>
                </div>
                <hr>
                 <p style="margin: 0; font-weight: bold;">Ride Confirmation</p>
                <div style="padding: 10px;">
                    <p>Hello,</p>
                    <p>We are pleased to inform you that your booking has been <strong>Accepted</strong>.</p>
                    <p>Here are the details of your booking:</p>
                    <p><strong>Booking Status:</strong> Accepted</p>
                    <p><strong>Confirmation Message:</strong> ${acceptMessage}</p>
                    <p>If you have any questions, feel free to contact us.</p>
                    <p>Thank you for choosing our service!</p>
                </div>
                <div style="text-align: center; padding-top: 15px; font-size: 10px;">
                    <p style="margin: 0;">&copy; 2025 Company Name. All Rights Reserved.</p>
                </div>
            </div>
        </body>
    </html>
    `;
    return emailContent;
};

// Reject Email Template
const generateRejectEmailTemplate = () => {
    const emailContent = `
    <html>
        <body>
            <div style="font-size: 12px; font-family: Arial, sans-serif;">
                <div style="display: flex; background-color: #f0f0f0; justify-content:space-between; align-items: center; font-size: 12px; font-family: Arial, sans-serif;">
                <img src="cid:logo" alt="Logo" style="max-width: 90px; height: auto; padding-top:5px; padding-left:5px">
                    <div style="padding-top:5px; padding-right:5px; line-height: 1;">
                        <p style="margin: 0; padding: 0; font-weight: bold;">Worldwide</p>
                        <p style="margin: 0; padding: 0; font-weight: bold;">Executive Transportation</p>
                    </div>
                </div>
                <hr>
                <p style="margin: 0; font-weight: bold;">Booking Status Update</p>
                <div style="padding: 10px;">
                    <p>Hello,</p>
                    <p>We regret to inform you that your booking has been <strong>Rejected</strong>.</p>
                    <p>Here are the details of your booking:</p>
                    <p>If you have any concerns or would like to discuss further, feel free to contact us.</p>
                    <p>Thank you for your understanding.</p>
                </div>
                <div style="text-align: center; padding-top: 15px; font-size: 10px;">
                    <p style="margin: 0;">&copy; 2025 Company Name. All Rights Reserved.</p>
                </div>
            </div>
           <div style="color: red; font-size: 12px; font-family: 'Courier New', Courier, monospace;">
            <p>CONFIDENTIALITY NOTICE:</p>
            <p>
            This e-mail transmission and any attachments that accompany it may contain information that is privileged, confidential, or otherwise exempt from disclosure under applicable law and is intended
            distribution, copying or other use or retention of this communication or its substance is prohibited. If you have received this communication in error, please immediately reply to the author via e-mail
            solely for the use of the individual(s) to whom it was intended to be addressed. If you have received this e-mail by mistake, or you are not the intended recipient, any disclosure dissemination,
            that you received this message by mistake and permanently delete the original and all copies of this e-mail and any attachments from your computer.
            </p>
            <p>
            Thank you.
            </p>
            </div>
        </body>
    </html>
    `;
    return emailContent;
};

module.exports = {
    generateAcceptEmailTemplate,
    generateRejectEmailTemplate
};