import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Mail, Calendar, Heart, Pill, AlertTriangle, Scissors, Save, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { getPatientProfile, updatePatientProfile, createPatientProfile } from '@/api/patient';
import { Patient } from '@/types';

export function Profile() {
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
  const watchedGender = watch('gender');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const response = await getPatientProfile() as any;

      if (response.data?.patient) {
        const patientData = response.data.patient;
        setPatient(patientData);
        setHasProfile(true);
        populateForm(patientData);
      } else {
        setHasProfile(false);
        setIsEditing(true); // Start in edit mode if no profile exists
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      if (error.message.includes('Patient profile not found')) {
        setHasProfile(false);
        setIsEditing(true); // Start in edit mode if no profile exists
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to load profile",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const populateForm = (patientData: Patient) => {
    setValue('name', patientData.name);
    setValue('email', patientData.email);
    setValue('phone', patientData.phone);
    setValue('age', patientData.age);
    setValue('gender', patientData.gender);
    setValue('emergencyContactName', patientData.emergencyContact.name);
    setValue('emergencyContactPhone', patientData.emergencyContact.phone);
    setValue('emergencyContactRelationship', patientData.emergencyContact.relationship);
    setValue('allergies', patientData.medicalHistory.allergies.join(', '));
    setValue('currentMedications', patientData.medicalHistory.currentMedications.join(', '));
    setValue('chronicConditions', patientData.medicalHistory.chronicConditions.join(', '));
    setValue('previousSurgeries', patientData.medicalHistory.previousSurgeries.join(', '));
  };

  const onSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      const updateData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        age: parseInt(data.age),
        gender: data.gender,
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship
        },
        medicalHistory: {
          allergies: data.allergies ? data.allergies.split(',').map((item: string) => item.trim()).filter((item: string) => item) : [],
          currentMedications: data.currentMedications ? data.currentMedications.split(',').map((item: string) => item.trim()).filter((item: string) => item) : [],
          chronicConditions: data.chronicConditions ? data.chronicConditions.split(',').map((item: string) => item.trim()).filter((item: string) => item) : [],
          previousSurgeries: data.previousSurgeries ? data.previousSurgeries.split(',').map((item: string) => item.trim()).filter((item: string) => item) : []
        }
      };

      let response;
      if (hasProfile) {
        response = await updatePatientProfile(updateData) as any;
      } else {
        response = await createPatientProfile(updateData) as any;
      }

      if (response.data?.patient) {
        setPatient(response.data.patient);
        setHasProfile(true);
        setIsEditing(false);
        toast({
          title: "Success",
          description: hasProfile ? "Profile updated successfully!" : "Profile created successfully!",
        });
      }
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded" />
                      <div className="h-3 bg-gray-200 rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {hasProfile ? 'My Profile' : 'Create Profile'}
          </h1>
          <p className="text-lg text-gray-600">
            {hasProfile ? 'Manage your personal and medical information' : 'Set up your patient profile'}
          </p>
        </div>
        {hasProfile && (
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
            className={!isEditing ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Name is required' })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name.message as string}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email', { required: 'Email is required' })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email.message as string}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      {...register('phone', { required: 'Phone is required' })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.phone && <p className="text-sm text-red-600">{errors.phone.message as string}</p>}
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      {...register('age', { required: 'Age is required', min: { value: 1, message: 'Age must be at least 1' } })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.age && <p className="text-sm text-red-600">{errors.age.message as string}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      disabled={!isEditing}
                      value={watchedGender}
                      onValueChange={(value) => setValue('gender', value)}
                    >
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-sm text-red-600">{errors.gender.message as string}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-red-600" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Name</Label>
                    <Input
                      id="emergencyContactName"
                      {...register('emergencyContactName', { required: 'Emergency contact name is required' })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.emergencyContactName && <p className="text-sm text-red-600">{errors.emergencyContactName.message as string}</p>}
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactPhone">Phone</Label>
                    <Input
                      id="emergencyContactPhone"
                      {...register('emergencyContactPhone', { required: 'Emergency contact phone is required' })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.emergencyContactPhone && <p className="text-sm text-red-600">{errors.emergencyContactPhone.message as string}</p>}
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                    <Input
                      id="emergencyContactRelationship"
                      {...register('emergencyContactRelationship', { required: 'Relationship is required' })}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                    {errors.emergencyContactRelationship && <p className="text-sm text-red-600">{errors.emergencyContactRelationship.message as string}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical History */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="allergies" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Allergies (comma-separated)
                  </Label>
                  <Textarea
                    id="allergies"
                    {...register('allergies')}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="e.g., Peanuts, Shellfish, Penicillin"
                  />
                </div>
                <div>
                  <Label htmlFor="currentMedications" className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-blue-500" />
                    Current Medications (comma-separated)
                  </Label>
                  <Textarea
                    id="currentMedications"
                    {...register('currentMedications')}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="e.g., Lisinopril 10mg, Metformin 500mg"
                  />
                </div>
                <div>
                  <Label htmlFor="chronicConditions" className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    Chronic Conditions (comma-separated)
                  </Label>
                  <Textarea
                    id="chronicConditions"
                    {...register('chronicConditions')}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="e.g., Hypertension, Diabetes, Asthma"
                  />
                </div>
                <div>
                  <Label htmlFor="previousSurgeries" className="flex items-center gap-2">
                    <Scissors className="h-4 w-4 text-purple-500" />
                    Previous Surgeries (comma-separated)
                  </Label>
                  <Textarea
                    id="previousSurgeries"
                    {...register('previousSurgeries')}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                    placeholder="e.g., Appendectomy (2018), Knee Surgery (2020)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : hasProfile ? 'Save Changes' : 'Create Profile'}
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={patient?.profileImage} alt={patient?.name || 'Patient'} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                    {patient?.name ? patient.name.split(' ').map(n => n[0]).join('') : 'P'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold text-gray-900">{patient?.name || 'Patient Name'}</h3>
                <p className="text-gray-600">{patient?.email || 'Email not set'}</p>
                {patient && (
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Badge variant="secondary">{patient.age} years old</Badge>
                    <Badge variant="outline">{patient.gender}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {patient && (
              <Card className="border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Health Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Allergies</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-200">
                      {patient.medicalHistory.allergies.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Medications</span>
                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                      {patient.medicalHistory.currentMedications.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Conditions</span>
                    <Badge variant="outline" className="text-red-600 border-red-200">
                      {patient.medicalHistory.chronicConditions.length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Surgeries</span>
                    <Badge variant="outline" className="text-purple-600 border-purple-200">
                      {patient.medicalHistory.previousSurgeries.length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}