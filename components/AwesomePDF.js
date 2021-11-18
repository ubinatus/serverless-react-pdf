import React from "react";
import { Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#ffffff",
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 20,
    paddingRight: 20,
    fontFamily: "Nunito",
  },
  pageTitle: {
    paddingBottom: 4,
    marginBottom: 0,
    paddingTop: 1.5,
    color: "#33424F",
  },
  pageTitleContainer: {
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#d8d8d8",
    marginBottom: 14,
  },
  title: {
    display: "flex",
    flexDirection: "row",
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    color: "#33424F",
    paddingBottom: 10,
  },
  description: {
    display: "flex",
    flexDirection: "row",
    fontSize: 12,
    fontWeight: "bold",
    alignItems: "center",
    color: "#33424F",
    paddingBottom: 10,
  }
});

const AwesomePDF = ({ pageTitle, awesomeVariableA, awesomeVariableB }) => {
  return (
    <Page style={styles.page} size="A4" orientation="portrait">
      <View>
        <View style={styles.pageView}>
          <View style={styles.pageTitleContainer}>
            <Text style={styles.pageTitle}>Awesome PDF 🔥</Text>
          </View>
        </View>
        <View style={styles.title}>
          <Text>{pageTitle}</Text>
        </View>
        <View style={styles.description}>
          <Text>awesomeVariableA: {awesomeVariableA}</Text>
        </View>
        <View style={styles.description}>
          <Text>awesomeVariableB: {awesomeVariableB}</Text>
        </View>
        <View style={styles.description}>
          <Text>
            Vivamus vitae lorem nec elit suscipit dictum. Donec eget risus
            magna. Donec ac aliquam dolor. Quisque a dictum orci, at suscipit
            diam. Duis sodales nulla lectus, a eleifend justo venenatis non.
            Morbi feugiat leo dictum est fringilla, sed ullamcorper diam
            feugiat. Aenean ipsum tortor, bibendum vel laoreet et, mattis vel
            ipsum.
          </Text>
        </View>
        <View style={styles.description}>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
            diam massa, iaculis eget mi quis, euismod dictum elit. Suspendisse
            tempor posuere faucibus. Cras mattis mollis neque, vitae mattis
            justo condimentum nec. Donec lacinia tellus turpis, feugiat faucibus
            enim facilisis vitae. Ut sit amet rhoncus urna. Etiam sollicitudin
            pharetra massa, id dictum lacus fermentum non. In hac habitasse
            platea dictumst. Pellentesque sagittis est vitae leo vulputate
            faucibus. Orci varius natoque penatibus et magnis dis parturient
            montes, nascetur ridiculus mus. Maecenas dictum tempus nunc, quis
            semper nunc auctor nec.
          </Text>
        </View>
        <View style={styles.description}>
          <Text>
            Aenean dolor magna, elementum ut fringilla ac, finibus eget eros. In
            viverra commodo lacus, nec egestas orci malesuada commodo. Ut
            rhoncus lorem tellus, ut viverra mi fringilla eu. Duis ante velit,
            viverra et accumsan sit amet, cursus fringilla nisi. Etiam cursus
            eros non orci sodales, quis venenatis tortor egestas. Vivamus
            venenatis augue ac nibh pharetra egestas. Phasellus sagittis, dui ut
            ullamcorper sodales, urna lectus varius tellus, vitae dictum arcu
            sem vel leo. Vivamus faucibus risus vel scelerisque ultricies. Ut
            tristique arcu ante, sit amet commodo est ultrices nec. Vivamus
            laoreet volutpat eros, ac rutrum ipsum dictum ac. Suspendisse at
            lacus sem.
          </Text>
        </View>
      </View>
    </Page>
  );
};

export default AwesomePDF;
