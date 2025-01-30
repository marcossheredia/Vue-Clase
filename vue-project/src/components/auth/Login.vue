<script setup>
    import { ref } from 'vue';
    //import { VueFire, VueFireAuth } from 'vuefire'

    import {signInWithEmailAndPassword,sendPasswordResetEmail} from 'firebase/auth'
    import { useCurrentUser, useFirebaseAuth } from 'vuefire'
    const emit = defineEmits(['logeado','solicitaRegistro']);

    const sUsuario=ref('');
    const sPassword=ref('');

    const auth = useFirebaseAuth();

    function presioneLogin(){
        signInWithEmailAndPassword(auth,sUsuario.value,sPassword.value)
        .then(loginOK)
        .catch(loginNOK);
        
    }

    function loginOK(userCredential) {
        // User signed in successfully
        const user = userCredential.user;
        // Perform actions after successful sign-in, e.g., redirect or update UI
        alert("Usuario autenticado correctamente");
        emit('logeado');
    }

    function loginNOK(reason){
        alert("Usuario equivocado intenta otra vez "+reason);
    }

    function presioneRegistrar(){
        emit('solicitaRegistro');
    }

    function presionaRecuperar(){
        sendPasswordResetEmail(auth,sUsuario.value);
    }

</script>

<template>
    <div id="contenedor-login">
        <h1> LOGIN</h1>
        <div>
            <label>USUARIO:</label>
            <input v-model="sUsuario" type="text"></input>
        </div>

        <div>
            <label>PASSWORD:</label>
            <input v-model="sPassword" type="password"></input>
        </div>

        <!--<v-btn @click="presioneLogin" prepend-icon="$vuetify">LOGEARSE</v-btn>-->
        <v-btn
        class="ma-2"
        color="primary"
        @click="presioneLogin">
        Accept
        <v-icon
          icon="mdi-login"
          end
        ></v-icon>
      </v-btn>
        <v-btn @click="presioneRegistrar" rounded="xs" >REGISTRARSE</v-btn>
        <v-btn @click="presionaRecuperar" rounded="xs">RECUPERAR CONTRASEÑA</v-btn>

        <v-chip closable>Yony</v-chip>
        <v-chip closable>Yony</v-chip>
        <v-chip closable>Yony</v-chip>
        <v-chip closable>Yony</v-chip>
        <v-chip closable>Yony</v-chip>

    </div>
</template>

<style scoped>
    #contenedor-login{
        background-color: aquamarine;
    }
</style>
