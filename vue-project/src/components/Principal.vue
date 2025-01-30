<script setup>
    import { ref } from 'vue';
    import Login from './auth/Login.vue';
    import Register from './auth/Register.vue';
    import Home from './home/Home.vue';

    const blLoginVisible=ref(true);
    const blRegistroVisible=ref(false);
    const blHomeVisible=ref(false);
    const drawer=ref(false);

    function mostrarRegistro(){
        blLoginVisible.value=false;
        blRegistroVisible.value=true;
    }

    function mostrarLogin(){
        blLoginVisible.value=true;
        blRegistroVisible.value=false;
    }

    function mostrarHome(){
        blHomeVisible.value=true;
        blLoginVisible.value=false;
    }


</script>

<template>
    <div id="contenedor_principal">
        <h1> MI PRIMERA APP</h1>
        <Login v-if="blLoginVisible" @logeado="mostrarHome" @solicitaRegistro="mostrarRegistro"/>
        <Register v-if="blRegistroVisible" @cambiarALogin="mostrarLogin"/>
        <Home v-if="blHomeVisible"/>
        <v-btn @click="drawer = true" > DRAWER</v-btn>
    </div>

    <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >

    </v-navigation-drawer>

</template>

<style scoped>

    #contenedor_principal{
        background-color:rgb(134, 255, 176);
        max-width: 600px;

    }

    

</style>
