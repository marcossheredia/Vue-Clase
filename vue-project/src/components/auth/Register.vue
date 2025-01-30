<script setup>
    import { ref } from 'vue';
    import { createUserWithEmailAndPassword,sendEmailVerification } from 'firebase/auth';
    import { useFirebaseAuth,useFirestore } from 'vuefire';
    import {collection, addDoc, setDoc,doc } from "firebase/firestore";
    import { VFileUpload } from 'vuetify/labs/VFileUpload'
    import { getStorage, uploadBytesResumable, getDownloadURL, ref as refStorage } from "firebase/storage";

    const sUsuarioRe=ref('');
    const sPasswordRe=ref('');
    const sRepetirPasswordRe=ref('');
    const errorMensaje=ref('');
    const buenMensaje=ref('');
    const sNombreUser=ref('');
    const files=ref([]);
    const isUploading=ref(false);
    const uploadProgress=ref(0);
    const downloadURL=ref('');

    const emit=defineEmits(["cambiarALogin"]);
    const auth=useFirebaseAuth();
    const db = useFirestore();
    const storage = getStorage();

    function presioneAceptar(){
        errorMensaje.value="";
        buenMensaje.value="";

        if(!sUsuarioRe.value || !sPasswordRe.value){
            errorMensaje.value="Porfavor complete todos los campos";
        }
        else{
            createUserWithEmailAndPassword(auth,sUsuarioRe.value,sPasswordRe.value)
            .then(registerOK)
            .catch(registerNOK);
        }

    }

    function registerOK(usuarioRegistrado){
        buenMensaje.value="Registro completado";
        //sendEmailVerification(auth.currentUser);
        //crearPerfil();
        uploadFile();
        
    }

    function registerNOK(error){
        
        if(error=="FirebaseError: Firebase: Error (auth/email-already-in-use)."){
            alert("USUARIO YA EXISTE, INTENTA LOGEARTE");
        }
        else{
            errorMensaje.value="FALLA POR: "+error;
        }
    }

    /**
     * Funcion que coge los datos del formulario visual y los inserta en la coleccion perfiles
     * de la base de datos
     */
    function crearPerfil(){
        const profileRef = collection(db, "/Profiles");
        const postRef=doc(profileRef, auth.currentUser.uid);
        setDoc(postRef,{nombre:sNombreUser.value,urlAvatar:downloadURL.value})
        //addDoc(collectionRefPerfiles,datosNuevoPerfil)
        .then(perfilInsertadoOK)
        .catch(perfilInsertadoNOK);
    }

    function perfilInsertadoOK(nuevoPerfilRef){
        alert("SE HA INSERTADO CORRECTAMENTE UN PERFIL NUEVO "+nuevoPerfilRef.id);
        emit("cambiarALogin");
    }

    function perfilInsertadoNOK(error){
        
    }
    

    function presioneCancelar(){
        emit("cambiarALogin");
    }

    function uploadFile() {
      //console.log("LLEGUE AQUI!!!!  ");
      if (files.value.length==0){
        crearPerfil();
        return;
      } 

      // For simplicity, let's upload only the first file in the array
      const file = files.value[0];
      const fileName = file.name;

      isUploading.value = true;
      uploadProgress.value = 0;
      downloadURL.value = null;

      
      try {
        // Create a reference in Firebase Storage
        const storageRef = refStorage(storage, 'uploads/DAW1/'+auth.currentUser.uid+'/'+fileName); // AQUI USARE REFSTORAGE EN LUGAR DE REF

        // Start upload with progress tracking
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploadProgress.value = Math.round(progress);
          },
          (error) => {
            console.error("Upload error:", error);
            isUploading.value = false;
            downloadURL.value = "MI URL DE AVATAR.....";
            crearPerfil();
          },
          () => {
            // Upload completed, get download URL
            getDownloadURL(uploadTask.snapshot.ref)
              .then((url) => {
                downloadURL.value = url;
                console.log("File available at", url);
                crearPerfil();
              })
              .finally(() => {
                isUploading.value = false;
              });
          }
        );
      } catch (error) {
        console.error("Unexpected error uploading file:", error);
        isUploading = false;
      }
    }

</script>

<template>
    <div id="contenedor-registro">
        <h1>REGISTRO</h1>

        <div>
            <label>USUARIO:</label>
            <input v-model="sUsuarioRe" type="text"></input>
        </div>

        <div>
            <label>PASSWORD:</label>
            <input v-model="sPasswordRe" type="password"></input>
        </div>

        <div>
            <label>REPETIR PASSWORD:</label>
            <input v-model="sRepetirPasswordRe" type="password"></input>
        </div>

        <div>
            <label>NOMBRE:</label>
            <input v-model="sNombreUser" type="text"></input>
        </div>

        <v-container class="pa-4">
    <!-- The v-file-upload component from vuetify-file-upload -->
    <v-file-upload
      v-model="files"
      accept="image/*"
      label="Choose a file"
      :disabled="isUploading"
    />

    <!--
    <v-btn
      color="primary"
      class="mt-4"
      :disabled="files.length==0 || isUploading"
      @click="uploadFile"
    >
      Upload
    </v-btn>
-->

    <v-progress-linear
      v-if="isUploading"
      class="mt-4"
      :value="uploadProgress"
      color="blue"
      height="6"
      striped
      animated
    ></v-progress-linear>

    <div class="mt-4" v-if="downloadURL">
      <h3>File uploaded successfully!</h3>
      <a :href="downloadURL" target="_blank">{{ downloadURL }}</a>
    </div>
  </v-container>

        <v-btn @click="presioneAceptar">ACEPTAR</v-btn>
        <v-btn @click="presioneCancelar">CANCELAR</v-btn>

        <label>{{ errorMensaje }}</label>
        <label>{{ buenMensaje }}</label>
    </div>
</template>

<style scoped>
    #contenedor-registro{
        background-color:bisque;
    }
</style>