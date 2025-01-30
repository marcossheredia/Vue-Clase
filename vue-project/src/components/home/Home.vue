<script setup>
    import { ref,onMounted } from 'vue';
    //import { db } from '@/firebase';
    import { useFirestore,useFirebaseAuth } from 'vuefire';
    import { doc, getDoc, getDocs , collection, setDoc, addDoc } from "firebase/firestore";

    const arPosts=ref([]);

    const sNombreUsuario=ref('');
    const sUrlAvatar=ref('');

    const sNuevoTitulo=ref('');
    const sNuevoCuerpo=ref('');
    const sNombreBotonAgregar=ref('Agregar');

    const db = useFirestore();
    const auth=useFirebaseAuth();

    //ESTA FUNCION SIEMPRE SE EJECUTA AL PINTAR UN COMPONENTE EN LA PANTALLA
    onMounted(() => {
        descargarPerfil();
    });

    function agregarPost(){
        const datosNuevoPost={ 
            //id:idNuevoPost, 
            title: sNuevoTitulo.value, 
            body: sNuevoCuerpo.value, 
            likes:0,
            imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTR6D8Wox_753mhLFRQWR8T_h_IC0n0LNeGag&s' };

        //const documentoRefPostNuevo=doc(db, "Profiles/yony1/Posts", ""+Date.now());
        const collectionRefPosts=collection(db,"Profiles/"+auth.currentUser.uid+"/Posts");
        //setDoc(documentoRefPostNuevo,datosNuevoPost)
        addDoc(collectionRefPosts,datosNuevoPost)
        .then(postInsertadoOK)
        .catch(postInsertadoNOK);

        /*
        const idNuevoPost=arPosts.value.length+1;
        arPosts.value.push();
        sNuevoTitulo.value='';
        sNuevoCuerpo.value='';
        */
    }

    function postInsertadoOK(nuevoPostRef){
        alert("SE HA INSERTADO CORRECTAMENTE "+nuevoPostRef.id);
    }

    function postInsertadoNOK(error){
        
    }

    function descargarPost(){
        const docRef = doc(db, "Profiles/"+auth.currentUser.uid+"/Posts", "post1");
        getDoc(docRef)
        .then(descargaOK)
        .catch(descargaNOK);
    }

    function descargarPosts(){
        //alert("EL ID DEL USER HASTA ESTE PUNTO ES: "+auth.currentUser.uid);
        const collectionRef = collection(db,"Profiles/"+auth.currentUser.uid+"/Posts/");
        getDocs(collectionRef)
        .then(descargaPostsOK)
        .catch(descargaPostsNOK);
    }

    function descargarPerfil(){
        const docRef = doc(db, "Profiles/", auth.currentUser.uid);
        getDoc(docRef)
        .then(descargaOKPerfil)
        .catch(descargaNOKPerfil);
    }

    function descargaPostsOK(postsDescargados){
        arPosts.value.splice(0,arPosts.value.length);

        for(const post of postsDescargados.docs){
            console.log(post.id, " => ", post.data());
            arPosts.value.push(post.data());
            //arPosts.value.push({id:post.id,title:post.data().title,body:post.data().body,likes:post.data().likes});
        }

        /*postsDescargados.forEach((post) => {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            arPosts.value.push(post.data());
        });*/
    }

    function descargaPostsNOK(error){

    }

    function descargaOK(docPost){

        if (docPost.exists()) {
            const datos = docPost.data();

            console.log("Document data:", datos);
            //arPosts.value.push(datos);
            
            //alert("Document data: TITULO: "+datos['title']);
        } else {
        // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    function descargaNOK(error){

    }

    function descargaOKPerfil(docPerfil){

    if (docPerfil.exists()) {
        const datos = docPerfil.data();

        console.log("Document data:", datos);
        sNombreUsuario.value=datos['nombre'];
        sUrlAvatar.value=datos['urlAvatar'];
        
        //alert("Document data: TITULO: "+datos['title']);
    } else {
    // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
    }

    function descargaNOKPerfil(error){

    }

</script>

<template>
    <h1>HOME</h1>

    <h1>{{sNombreUsuario}}</h1>
    <img v-bind:src="sUrlAvatar"/>

    <div class="contenedor-form">
        <input v-model="sNuevoTitulo" placeholder="Nuevo titulo de Post"/>
        <textarea v-model="sNuevoCuerpo" placeholder="Nuevo cuerpo de Post"/>
        <button @click="agregarPost">{{ sNombreBotonAgregar }}</button>
        <button @click="descargarPosts">DESCARGAR POSTS</button>

    </div>

    <div v-for="post in arPosts" v-bind:key="post.id" class="contenedor-post">
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
        <h3>{{ post.likes }}</h3>
        <!--<img v-bind:src="post.imagen"/>-->
    </div>



</template>

<style scoped>
    .contenedor-post{
        border: 2px solid;
        margin: 5px;
    }

    .contenedor-form{
        display: flex;
        flex-direction: column;
    }
</style>
