import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import api from '../api';

const TaskDetail = ({ route, navigation }) => {
  const { taskId } = route.params;
  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get('/errands/available');
        const found = response.data.find(t => t.id === taskId);
        setTask(found);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTask();
  }, [taskId]);

  const acceptTask = async () => {
    try {
      await api.post(`/errands/${taskId}/accept`);
      Alert.alert('Success', 'Errand accepted! You can now start the errand.');
      navigation.navigate('MyTasks');
    } catch (err) {
      Alert.alert('Error', 'Failed to accept errand.');
    }
  };

  if (!task) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.category}>{task.category}</Text>
      <Text style={styles.price}>KES {task.estimated_price}</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{task.description}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Pickup</Text>
        <Text style={styles.value}>{task.pickup_address}</Text>
      </View>
      {task.delivery_address && (
        <View style={styles.section}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={styles.value}>{task.delivery_address}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={acceptTask}>
        <Text style={styles.buttonText}>Accept Errand</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  category: { fontSize: 24, fontWeight: 'bold', color: '#4F46E5' },
  price: { fontSize: 20, color: '#10B981', marginVertical: 10 },
  section: { marginVertical: 15 },
  label: { fontSize: 14, color: '#999', fontWeight: 'bold' },
  value: { fontSize: 16, color: '#333', marginTop: 5 },
  button: {
    backgroundColor: '#4F46E5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default TaskDetail;
