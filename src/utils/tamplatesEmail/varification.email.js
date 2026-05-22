export const varificationEmail = (name, otp, accsessTocken, at) => {
  const link = `http://localhost:5000/user/api/v1/email/verify/?otp=${otp}&accsessTocken=${accsessTocken}&at=${at}`;

  return `
  <div style="background-color:#0f0f0f; padding:20px; font-family:Arial, sans-serif;">

    <table align="center" width="100%" style="max-width:500px; background:#1c1c1c; border-radius:10px; overflow:hidden; text-align:center;">

      <!-- Header -->
      <tr>
        <td style="background:#ff0000; padding:15px; font-size:22px; font-weight:bold; color:white;">
          MyTube
        </td>
      </tr>

      <!-- Title -->
      <tr>
        <td style="padding:20px 15px 10px; font-size:18px; font-weight:600; color:white;">
          OTP => <span> ${otp}</span>
        </td>
      </tr>

      <!-- Message -->
      <tr>
        <td style="padding:0 20px; font-size:14px; color:#bfbfbf; line-height:1.6;">
          Hi ${name}, <br><br>

          Welcome to <b style="color:white;">MyTube</b>! We're excited to have you on board.  
          To get started and unlock all features, please confirm your email address by clicking the button below.
          <br><br>

          This helps us keep your account secure and ensures a smooth experience on our platform.
        </td>
      </tr>

      <!-- Button -->
      <tr>
        <td style="padding:25px;">
        <a style="text-decoration:none; color:white;" href="${link}">
          <button 
            style="background:#1877f2; color:white; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block; font-size:14px;">
           
            Verify Email
            </button>
            </a>
        </td>
      </tr>

      <!-- Extra Info -->
      <tr>
        <td style="padding:0 20px; font-size:12px; color:#999; line-height:1.5;">
          If the button above doesn’t work, copy and paste this link into your browser:
          <br>
          <span style="color:#4da3ff;">${link}</span>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:15px; font-size:12px; color:#888;">
          If you did not create an account, no further action is required.
        </td>
      </tr>

      <tr>
        <td style="padding:10px; font-size:12px; color:#666;">
          © 2026 MyTube. All rights reserved.
        </td>
      </tr>

    </table>
  </div>
  `;
};
