import { Text, View , StyleSheet, TextInput, Button, Alert, useEffect, Pressable } from "react-native";
import { Link } from 'expo-router';
import * as React from 'react';




export default function Index() {

  const [text, onChangeText] = React.useState(0);
  const [number, onChangeNumber] = React.useState(0);
  const [API, onAPIChange] = React.useState('');
  const [magicLink, onMagicLinkChange] = React.useState('');
  const [apiText, onApiTextChange] = React.useState(0);



  //https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M
  const apiCall = (api) =>{
      //fetch('https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M')
      fetch(api)
      .then(response => response.json())
      .then(json => {
          console.log("hello " + json.feagi_url);
          onMagicLinkChange(json.feagi_url);
          return(json);
      })
  .catch(error => {
      console.error(error);
      });
  return("ok");
  }

  const regApiCall = (api) =>{
        //fetch('https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M')
        fetch(api)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            console.log("wtf " + json);
            //onMagicLinkChange(json.feagi_url);
            onApiTextChange(json);
            return(json);
        })
    .catch(error => {
        console.error(error);
        });
    return;
  }


  React.useEffect(() => {
    //https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M
        fetch('https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M')
          .then(response => response.json())
          .then(json => {

              console.log(json.feagi_url);
              var realAPI = json.feagi_url + "/v1/burst_engine/burst_counter"
              console.log(realAPI);
              //var apiString = getDataFromApi(realAPI);


              try {
                  let response = fetch(realAPI)
                  .then(response => response.json())
                  .then(json => {
                      console.log("logged were here " + json);
                      onAPIChange(json.toString());
                  })

                } catch (error) {
                  console.error(error);
                  //return(null);
                }




          })
          .catch(error => {
            console.error(error);
          });



    }, []);

    React.useEffect(() => {
        var addNum = regApiCall(magicLink + "/v1/burst_engine/burst_counter")
        console.log(addNum);
        onApiTextChange(addNum);
        console.log("api should be changing and showung here")
        }, [magicLink]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        {API + ": is the API"}
      </Text>

      <Text>Edit app/index.tsx to edit this screen.</Text>
      <Text>{number}</Text>
      <TextInput
      onChangeText={onChangeText}
      value={text}

      placeholder="useless placeholder"
      />

      <Button
        //onPress = {() => Alert.alert(text)}
        onPress = {() =>
            apiCall(text)}
        title="click me!"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

       <Text style={styles.paragraph}>{magicLink}</Text>
       <Text>{apiText}</Text>

       <Link replace href="/input" asChild>
            <Pressable>
                <Text>Navigate</Text>
            </Pressable>
       </Link>
    </View>
  );
}

const styles = StyleSheet.create({
    paragraph: {
        fontSize: 18,
        textAlign: 'center',
    }
});




export default Index;




