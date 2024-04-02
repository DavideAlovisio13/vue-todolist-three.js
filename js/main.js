import * as THREE from 'three';
import { toDoList } from './data.js'
// destrutturazione del metodo createApp, mettendola nella variabile vue
const { createApp } = Vue;


// iniziamo ad usare il metodo appena importato, ritornando la mia applicazione e montandola su #app
createApp({ //option object
    data() {
        return {
            toDoList: toDoList,
            elementText: ''
        }
    },
    methods: { // object methods
        // creiamo il toggle per passare done a true o false
        DoneTrueFalse(id) {
            // ritorniamo l'id in una costante 
            const idTDL = this.toDoList.find((el) => {
                return el.id === id;
            })
            // generiamo il toggle
            if (idTDL) {
                idTDL.done = !idTDL.done;
            }
        },

        // inseriamo un metodo per eliminare l'elemento selezionato dalla lista
        deleteElement(id) {
            // prendiamo l'idice dell'elemento
            const index = this.toDoList.findIndex((el) => el.id === id);
            // rimuoviamo l'elemento
            if (index !== -1) {
                this.toDoList.splice(index, 1);
            }
        },

        // inseriamo un metodo per aggiujere un elemento alla lista
        addElement() {
            const newElem = {
                id: null,
                text: this.elementText,
                done: false
            }
            // generiamo l'id del nuovo elemento
            let newId = 0;
            // per ogni elemento nella lista
            this.toDoList.forEach((el) => {
                if (newId < el.id) {
                    newId = el.id;
                }
            });
            // il nuovo itemento ha come id l'id massimo + 1
            newElem.id = newId + 1;
            //ripuliamo l'input
            this.elementText = '';
            // pushamo il nuovo elemento nella lista
            this.toDoList.push(newElem);
        }
    },
    mounted() {
        console.log(this.toDoList)
    } //lifecycle hook, inseriamo un console.log per controllare se this.toDoList funziona
}).mount('#app')


console.log(THREE)


const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf1f1f1 );

// creiamo gli oggetti di scena, mesh = geometria e materiale

// const geometry = new THREE.BoxGeometry(1, 1, 1);// larghezza, altezza, profondità
const geometry = new THREE.TorusKnotGeometry(10, 2, 300, 20, 5, 6);
// creiamo il materiale, stile con cui il cubo verrà rappresentato in un'ambiente 3D

// passiamo il colore con il quale andare a colorare il cubo
const material = new THREE.MeshNormalMaterial();// in questo caso ho usato il normalMaterial per il colore giusto per dare l'idea di profondità
// creiamo la mesh da aggiungere all'iterno della scena

// const mesh = new THREE.Mesh(geometry, material); // passiamo la geometria e il materiale
const mesh = new THREE.Mesh(geometry, material);

// aggiungiamo la mesh alla scena

scene.add(mesh);


// lascena deve essere ripresa da una cam, punto di osservazione (camera prospettica)


const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // fild of view (l'angolo verticale di apertura della nostra inquadratura), aspect ratio(il rapporto tra larghezza e altezza), near plane (da dove la nostra camera inizia a vedere), far plane(da dove la nostra camera finisce di vedere)
// impostiamo la posizione dalla quale la cam riprenderà 

camera.position.z = 50;

// ultimo elemento = reinderizza la nostra scena

const renderer = new THREE.WebGLRenderer();

// prima di reinderizzare dobbiamo andare a dire il campo di visione da reinderizzara

renderer.setSize(window.innerWidth, window.innerHeight);

// inseriamo nel DOM il canvas generato dall'oggetto renderer

document.body.appendChild(renderer.domElement); // il canvas è contenuto nella proprietà domElement di renderer

// non basta, se vogliamo rendere l'oggetto dinamico tramite un' animazione dobbiamo creare un loop che continui a generare nuovi render

function renderRate() {
    // andiamo a inserire il nostro primo render all'interno
    renderer.render(scene, camera);

    // deve chiamare se stessa seguendo il framerate del monitor dell'utente

    requestAnimationFrame(renderRate);

    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    mesh.rotation.z += 0.01;
    mesh.rotation.order = 'YXZ';

}

// faccimo il loop

requestAnimationFrame(renderRate);

// frame loop, 60 volte al minuto aggiurna il canvas generando un nuovo frame


//posizionamento dell'oggetto

// possiamo spostare il nostro oggetto all'interno della scena
const pos = new THREE.Vector3(-40, -20,);// creiamo un istanza con un vettore che possiede con attributi i 3 assi 
//assegnamo la posizione alla mesh
mesh.position.add(pos);

