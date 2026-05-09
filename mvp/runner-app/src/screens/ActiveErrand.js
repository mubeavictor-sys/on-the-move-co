import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import api from '../api';
import { MapPin, Camera, CheckCircle, Navigation } from 'lucide-react-native';

const ActiveErrand = ({ route, navigation }) => {
  const { errandId } = route.params;
  const [errand, setErrand] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const locationInterval = useRef(null);

  const fetchErrand = async () => {
    try {
      const response = await api.get('/errands/my');
      const found = response.data.find(e => e.id === errandId);
      setErrand(found);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchErrand();

    // Setup 30s location tracking
    locationInterval.current = setInterval(async () => {
        try {
            // Simulated location
            const lat = -1.286389 + (Math.random() - 0.5) * 0.01;
            const long = 36.817223 + (Math.random() - 0.5) * 0.01;
            
            await api.patch(`/errands/${errandId}/location`, { lat, long });
            console.log('Location pushed');
        } catch (err) {
            console.error('Failed to push location', err);
        }
    }, 30000);

    return () => {
        if (locationInterval.current) clearInterval(locationInterval.current);
    };
  }, [errandId]);

  const updateStatus = async (status) => {
    try {
      await api.patch(`/errands/${errandId}/status`, { 
          status,
          lat: -1.286, // Simulated
          long: 36.817 
      });
      fetchErrand();
      Alert.alert('Status Updated', `Errand is now: ${status}`);
    } catch (err) {
      Alert.alert('Error', 'Failed to update status');
    }
  };

  const submitCompletion = async () => {
    if (!photoUrl) {
        Alert.alert('Photo Required', 'Please provide a proof of completion photo URL.');
        return;
    }
    try {
        await api.post(`/errands/${errandId}/submit-completion`, {
            photo_url: photoUrl,
            lat: -1.286,
            long: 36.817
        });
        Alert.alert('Success', 'Completion submitted! Waiting for customer confirmation.');
        navigation.navigate('MyTasks');
    } catch (err) {
        Alert.alert('Error', 'Failed to submit completion');
    }
  };

  if (!errand) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.category}>{errand.category}</Text>
        <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{errand.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Instructions</Text>
        <Text style={styles.description}>{errand.description}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.locationRow}>
            <MapPin size={16} color="#4F46E5" />
            <Text style={styles.locationText}>{errand.pickup_address}</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        {errand.status === 'assigned' && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => updateStatus('in_transit')}>
                <Navigation size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.buttonText}>Start Journey</Text>
            </TouchableOpacity>
        )}

        {errand.status === 'in_transit' && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => updateStatus('arrived')}>
                <CheckCircle size={20} color="#fff" style={{marginRight: 8}} />
                <Text style={styles.buttonText}>I Have Arrived</Text>
            </TouchableOpacity>
        )}

        {errand.status === 'arrived' && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => updateStatus('in_progress')}>
                <Text style={styles.buttonText}>Start Working</Text>
            </TouchableOpacity>
        )}

        {errand.status === 'in_progress' && (
            <View style={styles.completionContainer}>
                <Text style={styles.label}>Proof of Completion (Photo URL)</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="https://imgur.com/your-proof-photo.jpg" 
                    value={photoUrl}
                    onChangeText={setPhotoUrl}
                />
                <TouchableOpacity style={styles.successButton} onPress={submitCompletion}>
                    <Camera size={20} color="#fff" style={{marginRight: 8}} />
                    <Text style={styles.buttonText}>Submit Completion</Text>
                </TouchableOpacity>
            </View>
        )}

        {errand.status === 'awaiting_confirmation' && (
            <View style={styles.infoBox}>
                <Text style={styles.infoText}>Waiting for customer confirmation...</Text>
            </View>
        )}
      </View>

      <View style={styles.footer}>
          <Text style={styles.gpsWarning}>GPS Tracking is ACTIVE. Location shared every 30s.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  category: { fontSize: 20, fontWeight: 'bold' },
  statusBadge: { backgroundColor: '#EEF2FF', paddingpx: 8, paddingPy: 4, borderRadius: 4 },
  statusText: { fontSize: 10, color: '#4F46E5', fontWeight: 'bold' },
  section: { marginBottom: 20 },
  label: { fontSize: 12, color: '#999', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 4 },
  description: { fontSize: 16, color: '#333' },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  locationText: { marginLeft: 8, fontSize: 14, color: '#666' },
  actionContainer: { marginTop: 'auto', marginBottom: 20 },
  primaryButton: { 
      backgroundColor: '#4F46E5', 
      padding: 16, 
      borderRadius: 12, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center' 
  },
  successButton: { 
      backgroundColor: '#10B981', 
      padding: 16, 
      borderRadius: 12, 
      flexDirection: 'row', 
      justifyContent: 'center', 
      alignItems: 'center',
      marginTop: 10
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  completionContainer: { backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, marginVertical: 10 },
  infoBox: { backgroundColor: '#F3F4F6', padding: 20, borderRadius: 12, alignItems: 'center' },
  infoText: { color: '#666', fontStyle: 'italic' },
  footer: { alignItems: 'center' },
  gpsWarning: { fontSize: 10, color: '#EF4444', fontWeight: 'bold' }
});

export default ActiveErrand;
