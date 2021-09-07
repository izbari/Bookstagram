import React from 'react'
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { Rating } from "react-native-rating-element";
import bookController from "../../controllers/bookController"

const BookCard = (props) => {
    return (
        <TouchableOpacity onPress={props.toNavigateBookHandler}>

            <View style={{ flex: 0.5, flexDirection: 'row', height: '70%', width: '95%', padding: 10, justifyContent: 'flex-start', marginLeft: 10, marginTop: 10 }}>

                <View style={{ backgroundColor: 'white', flex: 0.8, }}>
                    <Image
                        source={{ uri: "" + bookController.checkThumbnail(props.item) }}
                        style={{ height: 175, width: 120, resizeMode: 'cover', alignSelf: 'flex-start', borderRadius: 5 }}
                    />
                </View>

                <View style={{ backgroundColor: 'white', flex: 1.4, padding: 10, borderTopRightRadius: 10, borderBottomRightRadius: 10 }}>
                    <Text style={{ marginBottom: 7, color: "#575758", fontWeight: 'bold' }}>{bookController.checkTitle(props.item)}</Text>
                    <Text style={{ marginBottom: 10, color: "#A0A0A1", fontSize: 10 }}>{bookController.checkAuthor(props.item)}</Text>

                    <Rating
                        rated={5}
                        totalCount={2.5}
                        ratingColor="#FF6DA0"
                        ratingBackgroundColor="#d4d4d4"
                        size={15}
                        readonly
                        icon="ios-star"
                        direction="row"
                    />
                    <Text style={{ marginBottom: 5, marginTop: 5, fontSize: 10 }}>{bookController.checkDescription(props.item)}</Text>
                    <View
                        style={{
                            flexDirection: 'row', flex: 1,
                            justifyContent: 'center', alignContent: 'space-around'
                        }}>

                        <TouchableOpacity
                            style={{
                                marginTop: 17, backgroundColor: '#FF6EA1', elevation: 20,
                                shadowColor: '#52006A', flex: 1, height: 35, borderRadius: 5, shadowColor: 'black', justifyContent: 'center', marginRight: 10
                            }}
                            onPress={null}
                        >
                            <View>
                                <Text style={{ color: 'white', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Add to cart</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                elevation: 20,
                                shadowColor: '#52006A', marginTop: 17, backgroundColor: 'white', flex: 1, height: 35, justifyContent: 'center', borderRadius: 5
                            }}
                            onPress={() => props.favHandler(props.item)}
                        >
                            <View>
                                <Text style={{ color: 'black', fontSize: 12, textAlign: 'center', fontWeight: 'bold' }}>Add to wishlist</Text>
                            </View>
                        </TouchableOpacity>


                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}
export default BookCard;