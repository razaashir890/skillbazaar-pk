'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'

const signupSchema = z.object({
  role: z.enum(['freelancer', 'client', 'both']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(11, 'Please enter a valid phone number')
    .regex(/^03\d{2}-?\d{7}$/, 'Format: 03XX-XXXXXXX'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

type SignupFormData = z.infer<typeof signupSchema>

interface SignupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin: () => void
}

export function SignupModal({
  open,
  onOpenChange,
  onSwitchToLogin,
}: SignupModalProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'freelancer' | 'client' | 'both'>('freelancer')

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: 'freelancer',
      fullName: '',
      email: '',
      phone: '',
      password: '',
    },
  })

  const onSubmit = (data: SignupFormData) => {
    console.log('Signup:', data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Join SkillBazaar PK</DialogTitle>
          <DialogDescription>
            Free account banao aur apna freelance journey shuru karein
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-3">
            <Label>Main kaun hoon?</Label>
            <RadioGroup
              value={selectedRole}
              onValueChange={(value) => {
                const v = value as 'freelancer' | 'client' | 'both'
                setSelectedRole(v)
                form.setValue('role', v)
              }}
              className="grid grid-cols-3 gap-3"
            >
              <label
                htmlFor="role-freelancer"
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors ${
                  selectedRole === 'freelancer'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                    : 'border-border hover:border-emerald-300'
                }`}
              >
                <RadioGroupItem value="freelancer" id="role-freelancer" className="sr-only" />
                <span className="text-sm font-medium">Freelancer</span>
              </label>
              <label
                htmlFor="role-client"
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors ${
                  selectedRole === 'client'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                    : 'border-border hover:border-emerald-300'
                }`}
              >
                <RadioGroupItem value="client" id="role-client" className="sr-only" />
                <span className="text-sm font-medium">Client</span>
              </label>
              <label
                htmlFor="role-both"
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors ${
                  selectedRole === 'both'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950'
                    : 'border-border hover:border-emerald-300'
                }`}
              >
                <RadioGroupItem value="both" id="role-both" className="sr-only" />
                <span className="text-sm font-medium">Both</span>
              </label>
            </RadioGroup>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="signup-name">Full Name</Label>
            <Input
              id="signup-name"
              placeholder="Apna poora naam likhein"
              {...form.register('fullName')}
            />
            {form.formState.errors.fullName && (
              <p className="text-sm text-destructive">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email</Label>
            <Input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="signup-phone">Phone</Label>
            <Input
              id="signup-phone"
              type="tel"
              placeholder="03XX-XXXXXXX"
              {...form.register('phone')}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="signup-password">Password</Label>
            <div className="relative">
              <Input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Kam az kam 8 characters"
                className="pr-10"
                {...form.register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            or continue with
          </span>
        </div>

        <Button variant="outline" className="w-full" type="button">
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </Button>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            onClick={() => {
              onOpenChange(false)
              onSwitchToLogin()
            }}
          >
            Login
          </button>
        </p>
      </DialogContent>
    </Dialog>
  )
}
