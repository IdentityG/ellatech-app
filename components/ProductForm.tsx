import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import InputField from "./InputField";
import { useApp } from "../context/AppContext";
import {
  validateSKU,
  validatePrice,
  validateQuantity,
} from "../utils/helpers";

interface Props {
  onSuccess?: () => void;
}

const ProductForm = ({ onSuccess }: Props) => {
  const { registerProduct } = useApp();

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    sku?: string;
    name?: string;
    price?: string;
    quantity?: string;
  }>({});

  const validate = (): boolean => {
    const e: typeof errors = {};

    if (!sku.trim()) {
      e.sku = "SKU is required.";
    } else if (!validateSKU(sku)) {
      e.sku = "SKU must be 3–20 alphanumeric characters.";
    }

    if (!name.trim()) {
      e.name = "Product name is required.";
    }

    if (!price.trim()) {
      e.price = "Price is required.";
    } else if (!validatePrice(price)) {
      e.price = "Enter a valid price greater than 0.";
    }

    if (!quantity.trim()) {
      e.quantity = "Quantity is required.";
    } else if (!validateQuantity(quantity)) {
      e.quantity = "Enter a valid whole number greater than 0.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const result = registerProduct(
        sku,
        name,
        parseFloat(price),
        parseInt(quantity, 10)
      );
      setLoading(false);

      if (result.success) {
        Alert.alert("Success", result.message);
        setSku("");
        setName("");
        setPrice("");
        setQuantity("");
        setErrors({});
        onSuccess?.();
      } else {
        Alert.alert("Error", result.message);
      }
    }, 600);
  };

  const clear = (
    field: keyof typeof errors,
    setter: (v: string) => void,
    value: string
  ) => {
    setter(value);
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  return (
    <View className="mb-2">
      <InputField
        label="SKU"
        placeholder="e.g. PROD-001"
        value={sku}
        onChangeText={(t) => clear("sku", setSku, t)}
        error={errors.sku}
        autoCapitalize="characters"
      />

      <InputField
        label="Product Name"
        placeholder="e.g. Wireless Mouse"
        value={name}
        onChangeText={(t) => clear("name", setName, t)}
        error={errors.name}
        autoCapitalize="words"
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <InputField
            label="Price (ETB)"
            placeholder="0.00"
            value={price}
            onChangeText={(t) => clear("price", setPrice, t)}
            error={errors.price}
            keyboardType="decimal-pad"
          />
        </View>
        <View className="flex-1">
          <InputField
            label="Quantity"
            placeholder="0"
            value={quantity}
            onChangeText={(t) => clear("quantity", setQuantity, t)}
            error={errors.quantity}
            keyboardType="number-pad"
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={loading}
        className="bg-teal-600 rounded-xl py-3 items-center mt-2"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold text-base">
            Register Product
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ProductForm;