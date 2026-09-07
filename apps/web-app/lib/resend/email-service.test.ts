import { describe, expect, it, vi } from 'vitest'
import { Resend } from 'resend'
import { EmailService } from './email-service'

vi.mock('@/lib/env', () => ({ env: { FROM_EMAIL: 'noreply@example.com' } }))

for (const kind of ['verification', 'password reset'] as const) {
  describe(`${kind} delivery`, () => {
    const deliver = (service: EmailService) =>
      kind === 'verification'
        ? service.sendVerificationEmail({
            email: 'reader@example.com',
            verificationUrl: 'https://template.example/verify?token=test',
          })
        : service.sendPasswordResetEmail({
            email: 'reader@example.com',
            resetUrl: 'https://template.example/reset?token=test',
          })

    it('renders the template and uses the configured sender unchanged', async () => {
      const provider = new Resend('re_test')
      const send = vi
        .spyOn(provider.emails, 'send')
        .mockResolvedValue({ data: { id: 'test' }, error: null, headers: null })
      await deliver(new EmailService(provider))
      expect(send).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'noreply@example.com',
          to: 'reader@example.com',
          html: expect.stringContaining('https://template.example/'),
        })
      )
    })
    it('fails when the provider returns an error', async () => {
      const provider = new Resend('re_test')
      vi.spyOn(provider.emails, 'send').mockResolvedValue({
        data: null,
        headers: null,
        error: {
          name: 'validation_error',
          message: 'Invalid sender',
          statusCode: 422,
        },
      })
      const log = vi.spyOn(console, 'error').mockImplementation(() => {})
      await expect(deliver(new EmailService(provider))).rejects.toThrow(
        'email delivery failed'
      )
      log.mockRestore()
    })
  })
}
