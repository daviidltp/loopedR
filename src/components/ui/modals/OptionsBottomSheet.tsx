import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text';

// Componente de fondo personalizado para redondear bordes
const BottomSheetBackground = ({ style }: any) => (
  <View
    style={[
      style,
      {
        backgroundColor: Colors.backgroundSoft,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      },
    ]}
  />
);

export interface OptionsBottomSheetRef {
  expand: () => void;
  close: () => void;
}

interface Option {
  id: string;
  label: string;
  value: string;
}

interface OptionsBottomSheetProps {
  title: string;
  options: Option[];
  selectedValue: string;
  onOptionSelect: (value: string) => void;
}

export const OptionsBottomSheet = forwardRef<OptionsBottomSheetRef, OptionsBottomSheetProps>(
  ({ title, options, selectedValue, onOptionSelect }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    const snapPoints = useMemo(() => ['20%'], []);

    const handleCloseSheet = useCallback(() => {
      bottomSheetRef.current?.close();
    }, []);

    // Componente backdrop para cerrar solo al tocar fuera
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          onPress={handleCloseSheet}
          pressBehavior="close"
        />
      ),
      [handleCloseSheet]
    );

    const handleOptionPress = useCallback((value: string) => {
      onOptionSelect(value);
      handleCloseSheet();
    }, [onOptionSelect, handleCloseSheet]);

    useImperativeHandle(ref, () => ({
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      close: () => {
        handleCloseSheet();
      },
    }));

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={false}
        detached={true}
        backgroundComponent={props => <BottomSheetBackground {...props} />}
        onClose={handleCloseSheet}
        enableOverDrag={false}
        handleIndicatorStyle={{display: 'none'}}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.sheetContent}>
          <View style={styles.optionsContainer}>
            {options.map((option, index) => (
              <TouchableRipple
                key={option.id}
                style={styles.optionItem}
                onPress={() => handleOptionPress(option.value)}
                rippleColor={Colors.gray[700]}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.selectionCircle,
                    selectedValue === option.value && styles.selectedCircle
                  ]}>
                    {selectedValue === option.value && (
                      <View style={styles.innerCircle} />
                    )}
                  </View>
                  <AppText 
                    variant="bodyLarge" 
                    fontFamily="inter"
                    fontWeight="medium"
                    color={Colors.white}
                    style={styles.optionText}
                  >
                    {option.label}
                  </AppText>
                </View>
              </TouchableRipple>
            ))}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  optionsContainer: {
    width: '100%',

  },
  optionItem: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCircle: {
    borderColor: Colors.secondaryGreen,
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.secondaryGreen,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '400',
  },
}); 