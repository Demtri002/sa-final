import React, { useState } from 'react';
import { View, Text, Image, TextInput, SafeAreaView, ScrollView, TouchableOpacity , temponralyImage, Button} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/denuncia';
import { useUser } from '../content/context'


export default function Denuncia({ navigation }) {
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [erro, setErro] = useState(false)
    const { userLogado, setUserLogado } = useUser()
    const { denuncia, setDenuncia } = useUser()

    const handleTituloChange = (titulo) => { setTitulo(titulo) }
    const handleDescricaoChange = (descricao) => { setDescricao(descricao) }

    const authDenuncia = async () => {
        if (titulo != '' || descricao != '') {
            try {
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify({
                        titulo: titulo,
                        descricao: descricao,
                        usersid: userLogado.id
                    })
                }
                await fetch('http://172.20.10.8:3000/denuncia', requestOptions)
                const denuncias = await fetch("http://172.20.10.8:3000/denuncia")
                const json = await denuncias.json()
                setDenuncia(json)
                


            } catch (error) {
                // console.log("Erro post: " + error.message)
            } finally {
                navigation.navigate('SuasDenuncias')
            }
        } else {
            setErro(true)
        }
    }
    const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
    return (
        <SafeAreaView>
            <ScrollView>

                <View style={styles.container}>

                    <Text style={styles.title}>
                        Preencha as informações da sua denúncia
                        </Text>


                    <TextInput style={styles.input} placeholder='Título' onChange={e => setTitulo(e.target.value)} onChangeText={handleTituloChange}></TextInput>
                    <Text style={styles.texterro}>{erro == true ? 'Preencha os campos corretamente' : ''}</Text>

                    <TextInput style={styles.desc} onChange={e => setDescricao(e.target.value)} onChangeText={handleDescricaoChange} multiline={true} numberOfLines={10} placeholder='Descrição'></TextInput>
                    <Text style={styles.texterro}>{erro == true ? 'Preencha os campos corretamente' : ''}</Text>


                    <View style={{alignItems: 'center'}}>
                    <Button title="Selecionar arquivos" onPress={pickImage} style={styles.button}/>
                 {image && <Image source={{ uri: image }} style={{ width: 300, height: 300, marginTop: 50}} resizeMode='contain' />}
                 </View>
                            
                    <TouchableOpacity style={styles.button} onPress={authDenuncia} >
                        <Text style={styles.textButton}>Publicar</Text>
                    </TouchableOpacity>

                </View>



            </ScrollView>
        </SafeAreaView>
    )
}
