import { useState } from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Link } from 'expo-router'

import { AppButton } from '@/components/app-button'
import { AppTextInput } from '@/components/app-text-input'
import { Screen } from '@/components/screen'
import { ThemedText } from '@/components/themed-text'
import { Spacing } from '@/constants/theme'
import { signUp } from '@/lib/auth/authClient'
import { signUpSchema } from '@/lib/validators/authSchemas'
import { getFieldErrors } from '@/lib/validators/formErrors'

export default function SignUpScreen() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    const parsed = signUpSchema.safeParse({ name, email, password })
    if (!parsed.success) {
      setErrors(getFieldErrors(parsed.error))
      return
    }

    setErrors({})
    setFormError(null)
    setNotice(null)
    setLoading(true)
    const { error } = await signUp.email(parsed.data)
    setLoading(false)

    if (error) {
      setFormError(error.message ?? 'Could not create an account')
      return
    }

    // Dev signs you in immediately and the layout redirects to the dashboard.
    // When email verification is on (production), tell the user what's next.
    setNotice('Account created. Check your email to verify before signing in.')
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <ThemedText type="title">Create account</ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            A Better Stack account works on web and mobile.
          </ThemedText>

          <View style={styles.form}>
            <AppTextInput
              label="Name"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <AppTextInput
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
            <AppTextInput
              label="Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            {formError ? <ThemedText style={styles.formError}>{formError}</ThemedText> : null}
            {notice ? <ThemedText themeColor="textSecondary">{notice}</ThemedText> : null}

            <AppButton label="Create account" loading={loading} onPress={handleSubmit} />
          </View>

          <View style={styles.footer}>
            <ThemedText themeColor="textSecondary">Already have an account? </ThemedText>
            <Link href="/sign-in" asChild>
              <Pressable hitSlop={Spacing.two}>
                <ThemedText type="linkPrimary">Sign in</ThemedText>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: Spacing.four,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  subtitle: {
    marginBottom: Spacing.three,
  },
  form: {
    gap: Spacing.three,
  },
  formError: {
    color: '#e5484d',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.four,
  },
})
