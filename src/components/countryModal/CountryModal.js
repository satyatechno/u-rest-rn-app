import {ActivityIndicator, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useState} from 'react';
import Modal from 'react-native-modal';
import colors from 'src/styles/colors/colors';
import fonts from 'src/styles/texts/fonts';
import {findHeight, findSize} from 'src/helper/helper';
import {FlatList} from 'react-native-gesture-handler';
import CustomButton from '../customButton/CustomButton';
import {useEffect} from 'react';
import {fetchCountry} from 'src/api/authentication';
const Item = ({item, selected, setSelected}) => {
  return (
    <CustomButton
      onPress={() => setSelected(item)}
      disabled={item.id == selected?.id}
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flex: 1,
        }}>
        <Image
          style={{height: 27, width: 36, marginEnd: 15}}
          source={{uri: item?.flag}}
          resizeMode="cover"
        />
        <Text
          style={{
            color: colors.defaultBlack,
            fontFamily: fonts.Montserrat_Medium,
            fontSize: 16,
          }}>
          {`${item?.country_name} (${item?.code})`}
        </Text>
      </View>
      <View style={styles.iconContainer}>
        {item.id == selected?.id && <View style={styles.icon} />}
      </View>
    </CustomButton>
  );
};
const CountryModal = ({onCountrySelect}) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState({});
  const [data, setData] = useState();
  useEffect(() => {
    getCountryData();
  }, []);
  const getCountryData = async () => {
    try {
      const res = await fetchCountry();
      setData(res.data?.data?.countries);
      setSelected(res.data?.data?.countries?.[0]);
      onCountrySelect(res.data?.data?.countries?.[0]?.code);
    } catch (e) {
      console.log('error country list', e);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <ActivityIndicator color={colors?.appGreen} size="small" />;
  }
  return (
    <>
      {selected?.flag?.length ? (
        <CustomButton
          onPress={() => {
            setModalVisible(true);
          }}>
          <Image
            style={{height: 27, width: 36, marginEnd: 10}}
            source={{uri: selected?.flag}}
            resizeMode="cover"
          />
        </CustomButton>
      ) : null}
      <Modal
        isVisible={modalVisible}
        hasBackdrop={true}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}>
        <View
          style={{
            backgroundColor: colors.defaultWhite,
            borderRadius: 15,
            padding: 20,
          }}>
          <Text
            style={{
              color: colors.defaultBlack,
              fontFamily: fonts.Montserrat_SemiBold,
              fontSize: findSize(20),
            }}>
            {' '}
            Select Country
          </Text>
          <FlatList
            data={data}
            renderItem={({item, index}) => (
              <Item
                item={item}
                selected={selected}
                setSelected={pp => {
                  setSelected(pp);
                  onCountrySelect(pp.code);
                  setModalVisible(false);
                }}
              />
            )}
            keyExtractor={(item, index) => item?.id}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  backgroundColor: colors.appGray,
                  height: 1,
                  width: '100%',
                }}
              />
            )}
          />
        </View>
      </Modal>
    </>
  );
};

export default CountryModal;

const styles = StyleSheet.create({
  iconContainer: {
    height: findSize(17),
    width: findSize(17),
    borderRadius: findSize(2),
    borderWidth: 1,
    borderColor: colors.appGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: findSize(10),
    marginTop: findHeight(2),
  },
  icon: {
    height: findSize(6),
    width: findSize(6),
    backgroundColor: colors.appGreen,
  },
});
