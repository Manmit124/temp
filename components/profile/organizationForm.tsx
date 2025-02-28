import { useForm, Controller } from 'react-hook-form'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useEffect } from 'react'


interface FormData {
  name: string
  domain: string
  logo: File | null
  tagline: string
  about: string
  authors: string
  industry: string
  bg_color: string
  theme_color: string
}

interface OrganizationFormProps {
  onSubmit: (formData: FormData) => Promise<void>
  submitButtonText?: string
  isLoading?: boolean
  initialData?: Partial<FormData>
  isInitialLoading?: boolean
}

const OrganizationForm = ({
  onSubmit,
  submitButtonText = "Save Changes",
  isLoading = false,
  initialData,
  isInitialLoading = false
}: OrganizationFormProps) => {
  const { register, handleSubmit, watch, control, formState: { errors }, reset } = useForm<FormData>({
    defaultValues: {
      name: '',
      domain: '',
      tagline: '',
      about: '',
      authors: '',
      industry: '',
      bg_color: '#FFFFFF',
      theme_color: '#000000',
      logo: null
    }
  })


  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        domain: initialData.domain || '',
        tagline: initialData.tagline || '',
        about: initialData.about || '',
        authors: initialData.authors || '',
        industry: initialData.industry || '',
        bg_color: initialData.bg_color || '#FFFFFF',
        theme_color: initialData.theme_color || '#000000',
        logo: null
      })
    }
  }, [initialData, reset])
  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center  p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
  const aboutValue = watch('about', '');
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Organization Name</Label>
        <Input
          id="name"
          {...register('name', { required: 'Organization name is required' })}
          placeholder="Enter your organization name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Input
          id="domain"
          {...register('domain', { required: "Domain is required" })}
          placeholder="example.com"
        />
        {errors.domain && (
          <p className="text-sm text-red-500">{errors.domain.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Logo</Label>
        <Controller
          control={control}
          name="logo"
          render={({ field }) => (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          {...register('tagline', { required: 'Tagline is required' })}
          placeholder="Your organization's tagline"
        />
        {errors.tagline && (
          <p className="text-sm text-red-500">{errors.tagline.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="about">About Company</Label>
        <Textarea
          id="about"
          {...register('about', {
            required: 'About company is required',
            minLength: {
              value: 500,
              message: 'About company must be at least 500 characters long',
            },
          })}
          placeholder="Tell us about your organization"
          className="min-h-[100px]"
        />
        <div className='flex justify-between'>
          {errors.about && (
            <p className="text-sm text-red-500">{errors.about.message}</p>
          )}
          {aboutValue.length < 500 && (
            <p className="text-sm text-red-500 ml-auto">
              {`${aboutValue.length}* / 500`}
            </p>
          )}
        </div>

      </div>

      <div className="space-y-2">
        <Label htmlFor="authors">Authors</Label>
        <Input
          id="authors"
          {...register('authors', { required: 'Authors are required' })}
          placeholder="John Doe, Jane Smith"
        />
        {errors.authors && (
          <p className="text-sm text-red-500">{errors.authors.message}</p>
        )}
        <p className="text-sm text-muted-foreground">
          Separate multiple authors with commas
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          {...register('industry', { required: 'Industry is required' })}
          placeholder="Your industry"
        />
        {errors.industry && (
          <p className="text-sm text-red-500">{errors.industry.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="bg_color">Background Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              id="bg_color"
              {...register('bg_color')}
              className="w-12 h-12 p-1 rounded-md"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme_color">Theme Color</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="color"
              id="theme_color"
              {...register('theme_color')}
              className="w-12 h-12 p-1 rounded-md"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          submitButtonText
        )}
      </Button>
    </form>
  )

}

export default OrganizationForm