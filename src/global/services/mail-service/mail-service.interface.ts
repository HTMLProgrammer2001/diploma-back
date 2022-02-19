export abstract class MailServiceInterface {
  /**
   * Send mail to teacher with url to login
   * @param email - teacher email
   * @param token - teacher access token
   */
  abstract sendTeacherLoginMail(email: string, token: string): Promise<void>;
}
