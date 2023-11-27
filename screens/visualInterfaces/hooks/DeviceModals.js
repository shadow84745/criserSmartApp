// Importaciones necesarias
import React, { memo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Componente AjustesModal
const AjustesModal = memo(({ visible, onClose, onDelete, onEdit }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Ajustes</Text>

          <TouchableOpacity onPress={onEdit} style={styles.buttonEdit}>
            <Text style={styles.buttonEditText}>Editar dispositivo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete} style={styles.buttonDelete}>
            <Text style={styles.buttonDeleteText}>Borrar dispositivo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

// Componente ConfirmDeleteModal
const ConfirmDeleteModal = memo(({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>¿Está seguro de que desea eliminar este dispositivo?</Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonExit]}
            onPress={onConfirm}
          >
            <Text style={styles.modalButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

// Componente RecomendacionesModal
const RecomendacionesModal = memo(({ visible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>Recomendaciones para su dispensador:</Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={onClose}
          >
            <Text style={styles.modalButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

// Estilos comunes para los modales
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#00B5E2',
    width: 100,
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalButtonExit: {
    backgroundColor: 'red',
  },
  buttonDelete: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDeleteText: {
    fontWeight: 'bold',
    color: '#fff'
  },
  buttonEdit: {
    backgroundColor: '#F1C400',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonEditText: {
    fontWeight: 'bold',
    color: '#fff'
  }
});

export { AjustesModal, ConfirmDeleteModal, RecomendacionesModal };
