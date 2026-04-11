import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth, db, storage } from "../lib/firebase";
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import toast from 'react-hot-toast';

const AuthContext = createContext();

const adminEmails = [
  "danportaleshinostroza@crackthecode.la",
  "zanadrianzenbohorquez@crackthecode.la",
  "marandersonsantillan@crackthecode.la",
  "shavalerianoblas@crackthecode.la",
  "pet123@gmail.com", 
];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe estar dentro de un AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  const registrarUsuario = async (correo, nombre, username, contrasena, foto) => {
    const usernameLower = username.toLowerCase();
    const q = query(collection(db, "usuarios"), where("username", "==", usernameLower));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      throw new Error("El nombre de usuario ya está en uso.");
    }

    const res = await createUserWithEmailAndPassword(auth, correo, contrasena);
    const user = res.user;

    let fotoURL = "/default-user.png";
    if (foto) {
        const storageRef = ref(storage, `perfiles/${user.uid}/${Date.now()}-${foto.name}`);
        await uploadBytes(storageRef, foto);
        fotoURL = await getDownloadURL(storageRef);
    }
    
    await setDoc(doc(db, "usuarios", user.uid), {
      uid: user.uid, // Guardamos el uid para referencia
      correo: user.email,
      nombre: nombre,
      username: usernameLower,
      rol: "cliente", 
      fotoURL: fotoURL,
      fechaCreacion: serverTimestamp(),
    });

    await updateProfile(user, { displayName: nombre, photoURL: fotoURL });

    return res;
  };

  const iniciarSesion = async (identifier, contrasena) => {
    let correo = identifier;
    if (!identifier.includes('@')) {
        const usernameLower = identifier.toLowerCase();
        const q = query(collection(db, "usuarios"), where("username", "==", usernameLower));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error("Usuario o contraseña incorrectos.");
        }
        const userData = querySnapshot.docs[0].data();
        correo = userData.correo;
    }
    return signInWithEmailAndPassword(auth, correo, contrasena);
  };

  const iniciarConGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      const userRole = adminEmails.includes(user.email.toLowerCase()) ? "admin" : "cliente";
      const usernameFromEmail = user.email.split('@')[0].toLowerCase();
      
      const newUserDoc = {
        uid: user.uid,
        correo: user.email,
        nombre: user.displayName || 'Usuario Google',
        username: usernameFromEmail,
        rol: userRole,
        fotoURL: user.photoURL || "/default-user.png",
        fechaCreacion: serverTimestamp(),
      };
      await setDoc(docRef, newUserDoc);
    }
    return result;
  };

  const cerrarSesion = () => signOut(auth);

  const actualizarPerfil = async ({ nombre, username, imageFile }) => {
    const promise = new Promise(async (resolve, reject) => {
        if (!usuarioActual) return reject(new Error("No hay usuario autenticado."));

        const userRef = doc(db, "usuarios", usuarioActual.uid);
        const updateData = {};
        let newPhotoURL = usuarioActual.fotoURL;

        if (nombre && nombre !== usuarioActual.nombre) updateData.nombre = nombre;
        if (username && username.toLowerCase() !== usuarioActual.username) {
            const usernameLower = username.toLowerCase();
            const q = query(collection(db, "usuarios"), where("username", "==", usernameLower));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty && querySnapshot.docs[0].id !== usuarioActual.uid) {
              return reject(new Error("El nombre de usuario ya está en uso."));
            }
            updateData.username = usernameLower;
        }

        if (imageFile) {
            const oldPhotoURL = usuarioActual.fotoURL;
            const storageRef = ref(storage, `perfiles/${usuarioActual.uid}/${Date.now()}-${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            newPhotoURL = await getDownloadURL(storageRef);
            updateData.fotoURL = newPhotoURL;

            if (oldPhotoURL && oldPhotoURL.includes('firebasestorage')) {
                try {
                    await deleteObject(ref(storage, oldPhotoURL));
                } catch (error) {
                    console.warn("No se pudo borrar la foto antigua:", error);
                }
            }
        }
        
        if (Object.keys(updateData).length > 0) {
            await updateDoc(userRef, updateData);
        }
        
        await updateProfile(auth.currentUser, {
            displayName: updateData.nombre || usuarioActual.nombre,
            photoURL: newPhotoURL,
        });

        resolve({ newPhotoURL, imageFile, updated: Object.keys(updateData).length > 0 });
    });

    toast.promise(promise, {
        loading: 'Actualizando perfil...',
        success: ({ newPhotoURL, imageFile, updated }) => {
            if (imageFile) {
                toast.custom((t) => (
                  <div
                    className={`${t.visible ? 'animate-enter' : 'animate-leave'} relative max-w-sm w-full bg-gradient-to-r from-[#7e1d91] via-[#9f53c1] to-[#bd6fe4] shadow-2xl rounded-3xl pointer-events-auto ring-1 ring-white/10 overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.28),_transparent_45%)] pointer-events-none" />
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="absolute top-3 right-3 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                    >
                      <span className="sr-only">Cerrar</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="flex items-center p-5 gap-4 relative">
                        <div className="flex-shrink-0 relative">
                            <div className="h-16 w-16 rounded-2xl overflow-hidden shadow-xl border border-white/20 bg-white/20">
                              <img
                                  className="h-full w-full object-cover"
                                  src={newPhotoURL}
                                  alt="Nueva foto de perfil"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-[#5eead4] rounded-full p-1 border-2 border-white shadow-sm">
                                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-lg font-semibold text-white">
                                ¡Éxito!
                            </p>
                            <p className="mt-1 text-sm text-[#f3e6ff]">
                                Tu foto de perfil ha sido actualizada.
                            </p>
                        </div>
                    </div>
                  </div>
                ), { duration: 6000, id: 'custom-image-toast' });
                return "";
            } else if (updated) {
                return '¡Perfil actualizado con éxito!';
            } else {
                return 'No se realizaron cambios.';
            }
        },
        error: (err) => err.message || 'Hubo un error al actualizar.',
    });
    await promise.catch(() => {}); // Evita unhandled promise rejection en consola
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firestoreData = docSnap.data();
          setUsuarioActual({ uid: user.uid, ...user, ...firestoreData });
        } else {
          setUsuarioActual(user);
        }
      } else {
        setUsuarioActual(null);
      }
      setCargando(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    usuarioActual,
    cargando,
    registrarUsuario,
    iniciarSesion,
    iniciarConGoogle,
    cerrarSesion,
    actualizarPerfil,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
