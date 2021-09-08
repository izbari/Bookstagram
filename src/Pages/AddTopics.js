import { Avatar, Badge, Icon, withBadge, CheckBox } from 'react-native-elements';
import React from 'react';
import {
    StyleSheet,
    FlatList,
    SafeAreaView,
    View,
    Text,

    TouchableOpacity,
} from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { ToastAndroid } from 'react-native';
import axios from 'axios';


import Loading from '../components/Loading';
import Error from '../components/Error';

import useFetch from '../hooks/useFetch'
function Discover(props) {

    // States hooks
    const [current, setCurrent] = React.useState(9);
    const [checked, setChecked] = React.useState([])
    const { loading, error, data, categories } = useFetch();
    const [selectedIds, setSelectedIds] = React.useState([])
    console.log("data:", data)




    const handleSelectionMultiple = (id) => {
        var selectedId = [...selectedIds] // clone state
        if (selectedId.includes(id)) { selectedId = selectedId.filter(_id => _id !== id) }

        else { selectedId.push(id) }

        setSelectedIds(selectedId)
    }

    if (error) {
        return <Error style={styles.lottieContainer} />
    }
    if (loading) {
        return <Loading style={styles.lottieContainer} />
    }

    const loadMore = () => {

        console.log('Loading')
        if (current > data.length) {
            ToastAndroid.showWithGravityAndOffset(
                'All Topics are Showing',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50,
            );
        } else {
            setCurrent(current + 9);
        }
    };



    const bookAvatar = ({ item, index }) => (
        <TouchableOpacity onPress={() => handleSelectionMultiple(item.id)}>


            <View style={{ height: 110, width: 100, margin: 17.5, marginBottom: 20 }}>
                <Image
                    style={{ height: 95, width: 95, resizeMode: 'contain', borderRadius: 50, overflow: 'hidden', }}
                    source={{
                        uri: data[index].url,
                    }}
                    size="large"

                    indicator={ProgressBar.indeterminate}
                    indicatorProps={{
                        size: 20,
                        borderWidth: 0,
                        color: 'rgba(150, 150, 150, 1)',
                        unfilledColor: 'rgba(200, 200, 200, 0.2)'
                    }}
                >
                    <CheckBox
                        center
                        containerStyle={{ backgroundColor: "transparent", borderWidth: 0 }}
                        unchecked="radio"
                        iconType='material'
                        checkedIcon='check'
                        size={70}
                        disabled={true}
                        checkedColor='lightgrey'
                        checked={selectedIds.includes(item.id) ? true : false}
                        activeOpacity={1}
                    />
                </Image>


                <Text style={{ fontWeight: 'bold', alignSelf: 'center' }}>
                    {categories[index]}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={{ backgroundColor: '#FF6EA1', padding: 10 }}>
                <Text
                    style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18,
                        margin: 10,
                        marginBottom: 0,
                    }}>
                    Welcome
                </Text>
                <Text
                    style={{
                        color: 'white',
                        marginLeft: 10,
                        marginBottom: 5,
                        fontSize: 18,
                    }}>
                    Choose the topics
                </Text>
            </View>
            <FlatList
                data={data.slice(0, current)}
                keyExtractor={(item => item.id)}
                renderItem={bookAvatar}
                numColumns="3"
            />
            <TouchableOpacity
                onPress={() => loadMore()}>
                <Text
                    style={{
                        alignSelf: 'center',
                        marginBottom: 10,

                        color: '#FF6EA1',
                        textDecorationLine: 'underline',
                    }}>
                    More Topics
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => props.navigation.navigate("Library")}
                style={{
                    width: '80%',
                    height: '6%',
                    borderRadius: 5,
                    backgroundColor: '#FF6EA1',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                }}>
                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
                    Apply
                </Text>
            </TouchableOpacity>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: 'white' },
    lottieContainer: {
        flex: 2,
        width: '85%',
        height: '30%',
        alignSelf: 'center',
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    buttonContainer: { flex: 1, margin: 10 },
    button: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
        width: 290,
        height: 38,
        backgroundColor: '#FF6EA1',
        justifyContent: 'center',
        alignSelf: 'center',
        margin: 10,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        paddingLeft: 12,
        borderRadius: 10,

        width: 290,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
        margin: 10,
        backgroundColor: 'white',
    },
});
export default Discover;