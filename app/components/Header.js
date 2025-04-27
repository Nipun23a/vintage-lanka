import {View, StyleSheet, Text,TouchableOpacity} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import {useNavigation} from "@react-navigation/native";

const Header = ({title,showBackButton,onBackPress}) => {
    const  navigation = useNavigation()

    return(
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    {showBackButton && (
                        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                            <FontAwesome name="arrow-left" size={20} color="black" />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.headerTitle}>{title}</Text>
                </View>
                <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
                    <FontAwesome name="shopping-cart" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        marginTop: 10,
        paddingBottom: 8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat_Bold',
    },
    cartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default Header;