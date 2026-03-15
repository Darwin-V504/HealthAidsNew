import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  setUser, 
  updateUser, 
  updateProfileImage,
  setLoading,
  setError,
  logout,
  clearError 
} from '../store/clientSlice'; // Ruta correcta sin /slices/
import { apiClient } from '../services/apiClient';
import { useAuth } from '../contexts/AuthContext';
import { ClientState } from '../store/clientSlice'; // Importamos el tipo

export const useClient = () => {
  const dispatch = useAppDispatch();
  const client = useAppSelector(state => state.client);
  const { updateUserData } = useAuth();

  const saveClientProfile = (profileData: any) => {
    const userData: Partial<ClientState> = {
      id: Date.now(), // Generar un ID temporal, en un caso real esto vendría del backend
      email: profileData.email,
      fullName: profileData.fullName,
      phone: profileData.phone || '',
      birthDate: profileData.birthDate || '',
      bloodType: undefined,
      allergies: [],
      chronicConditions: [],
      emergencyContact: undefined,
      profileImage: null,
    };
    
    dispatch(setUser(userData));
    if (updateUserData) updateUserData(userData);
  };

  const loadClientProfile = async (userId: number) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.get(`/clients/${userId}`);
      
      if (response.data) {
        const userData: Partial<ClientState> = {
          id: response.data.id,
          email: response.data.email,
          fullName: response.data.fullName || response.data.name,
          phone: response.data.phone,
          birthDate: response.data.birthDate,
          bloodType: response.data.bloodType,
          allergies: response.data.allergies || [],
          chronicConditions: response.data.chronicConditions || [],
          emergencyContact: response.data.emergencyContact,
          profileImage: response.data.profileImage,
        };
        
        dispatch(setUser(userData));
        if (updateUserData) updateUserData(userData);
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Error al cargar perfil'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateClientProfile = async (userId: number, updates: Partial<ClientState>) => {
    try {
      dispatch(setLoading(true));
      const response = await apiClient.put(`/clients/${userId}`, updates);
      
      if (response.data) {
        dispatch(updateUser(updates));
        if (updateUserData) updateUserData(updates);
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Error al actualizar perfil'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateProfilePicture = async (userId: number, imageUri: string) => {
    try {
      dispatch(setLoading(true));
      
      const formData = new FormData();
      formData.append('profileImage', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);

      const response = await apiClient.post(`/clients/${userId}/profile-image`, formData);

      if (response?.imageUrl) {
        dispatch(updateProfileImage(response.imageUrl));
        
        const profileUpdate: Partial<ClientState> = { profileImage: response.imageUrl };
        if (updateUserData) updateUserData(profileUpdate);
      }
    } catch (err: any) {
      dispatch(setError(err.message || 'Error al actualizar foto'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const addAllergy = (allergy: string) => {
    const currentAllergies = client.allergies || [];
    if (!currentAllergies.includes(allergy)) {
      const updatedAllergies = [...currentAllergies, allergy];
      
      const allergyUpdate: Partial<ClientState> = { allergies: updatedAllergies };
      dispatch(updateUser(allergyUpdate));
      
      if (updateUserData) updateUserData(allergyUpdate);
    }
  };

  const removeAllergy = (allergy: string) => {
    const updatedAllergies = (client.allergies || []).filter((a: string) => a !== allergy);
    
    const allergyUpdate: Partial<ClientState> = { allergies: updatedAllergies };
    dispatch(updateUser(allergyUpdate));
    
    if (updateUserData) updateUserData(allergyUpdate);
  };

  const addChronicCondition = (condition: string) => {
    const currentConditions = client.chronicConditions || [];
    if (!currentConditions.includes(condition)) {
      const updatedConditions = [...currentConditions, condition];
      
      const conditionUpdate: Partial<ClientState> = { chronicConditions: updatedConditions };
      dispatch(updateUser(conditionUpdate));
      
      if (updateUserData) updateUserData(conditionUpdate);
    }
  };

  const removeChronicCondition = (condition: string) => {
    const updatedConditions = (client.chronicConditions || []).filter((c: string) => c !== condition);
    
    const conditionUpdate: Partial<ClientState> = { chronicConditions: updatedConditions };
    dispatch(updateUser(conditionUpdate));
    
    if (updateUserData) updateUserData(conditionUpdate);
  };

  const updateEmergencyContact = (contact: { name: string; phone: string; relationship: string }) => {
    const contactUpdate: Partial<ClientState> = { emergencyContact: contact };
    dispatch(updateUser(contactUpdate));
    
    if (updateUserData) updateUserData(contactUpdate);
  };

  const clearClientProfile = () => {
    dispatch(logout());
  };

  const clearClientError = () => {
    dispatch(clearError());
  };

  return {
    client,
    isLoading: client.loading,
    error: client.error,
    isAuthenticated: client.isAuthenticated,

    saveClientProfile,
    loadClientProfile,
    updateClientProfile,
    updateProfilePicture,
    addAllergy,
    removeAllergy,
    addChronicCondition,
    removeChronicCondition,
    updateEmergencyContact,
    clearClientProfile,
    clearClientError,

    fullName: client.fullName,
    email: client.email,
    phone: client.phone,
    birthDate: client.birthDate,
    bloodType: client.bloodType,
    allergies: client.allergies || [],
    chronicConditions: client.chronicConditions || [],
    emergencyContact: client.emergencyContact,
    profileImage: client.profileImage,
  };
};