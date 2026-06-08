'use client'

import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '@/contexts/ShopContext'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Button from '@/components/Button'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  street: string
  city: string
  country: string
  dateOfBirth: string
}

export default function ProfilePage() {
  const ctx = useContext(ShopContext)!
  const { navigate, token, userData, getUserProfile, updateUserProfile } = ctx
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProfileForm>({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', country: 'Uganda', dateOfBirth: '',
  })

  useEffect(() => {
    if (!token) { navigate.push('/login'); return }
    const load = async () => {
      const profile = await getUserProfile() as Record<string, string> | null
      setFormData({
        firstName: profile?.first_name ?? '',
        lastName: profile?.last_name ?? '',
        email: userData?.email ?? '',
        phone: profile?.phone ?? '',
        street: profile?.street ?? '',
        city: profile?.city ?? '',
        country: profile?.country ?? 'Uganda',
        dateOfBirth: profile?.date_of_birth ?? '',
      })
      setLoading(false)
    }
    load()
  }, [token])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await updateUserProfile({
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      street: formData.street,
      city: formData.city,
      country: formData.country,
      date_of_birth: formData.dateOfBirth,
    })
    if (result.success) setIsEditing(false)
    setIsSubmitting(false)
  }

  if (loading) {
    return <div className="pt-14 flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="pt-14 pb-16 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xs font-bold text-gray-900">My Profile</h1>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
        )}
      </div>

      <motion.form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: 'firstName',   label: 'First Name',    placeholder: 'John' },
            { name: 'lastName',    label: 'Last Name',     placeholder: 'Doe' },
            { name: 'email',       label: 'Email',         placeholder: 'you@example.com', type: 'email', disabled: true },
            { name: 'phone',       label: 'Phone',         placeholder: '+256 700 000000' },
            { name: 'street',      label: 'Street Address',placeholder: '123 Main St' },
            { name: 'city',        label: 'City',          placeholder: 'Kampala' },
            { name: 'dateOfBirth', label: 'Date of Birth', placeholder: '', type: 'date' },
          ].map(field => {
            const fieldId = `profile-${field.name}`
            return (
              <div key={field.name}>
                <label htmlFor={fieldId} className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                <input
                  id={fieldId}
                  name={field.name}
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  value={(formData as unknown as Record<string, string>)[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing || field.disabled}
                  className="w-full border border-gray-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500" />
              </div>
            )
          })}
          <div>
            <label htmlFor="profile-country" className="block text-xs font-medium text-gray-500 mb-1">Country</label>
            <select id="profile-country" name="country" title="Country" value={formData.country} onChange={handleChange} disabled={!isEditing}
              className="w-full border border-gray-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-50">
              <option>Uganda</option>
              <option>Kenya</option>
              <option>Tanzania</option>
              <option>Rwanda</option>
            </select>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={isSubmitting} fullWidth>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </motion.form>
    </div>
  )
}
