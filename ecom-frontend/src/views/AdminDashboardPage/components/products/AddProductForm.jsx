// Form for adding or editing products in admin panel
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import TextInput from '../../../../components/ui/forms/TextInput';
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createDashboardProduct, loadCategoryList, modifyDashboardProduct } from '../../../../store/actions';
import toast from 'react-hot-toast';
import SelectDropdown from '../../../../components/ui/forms/SelectDropdown';
import ErrorDisplay from '../../../../components/ui/feedback/ErrorDisplay';

const AddProductForm = ({ setOpen, product, update=false}) => {
// State for button loading
const [loader, setLoader] = useState(false);

// State for selected category
const [selectedCategory, setSelectedCategory] = useState();

// Get category list from Redux store
const { categoryList } = useSelector((state) => state.catalog);

// Get loading and error states
const { categoryLoader, errorMessage } = useSelector((state) => state.errors);

// Redux dispatcher
const dispatch = useDispatch();

// Form validation using react-hook-form
const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
} = useForm({
    mode: "onTouched"
});

// Handle form submission (create or update product)
const saveProductHandler = (data) => {
    if(!update) {
        // Creating new product - add category ID
        const sendData = {
            ...data,
            categoryId: selectedCategory.categoryId,
        };
        dispatch(createDashboardProduct(
            sendData, toast, reset, setLoader, setOpen
        ));
    } else {
        // Updating existing product - add product ID
        const sendData = {
            ...data,
            id: product.id,
        };
        dispatch(modifyDashboardProduct(sendData, toast, reset, setLoader, setOpen));
    }
};

// When editing, fill form with existing product data
useEffect(() => {
    if (update && product) {
        setValue("productName", product?.productName);
        setValue("price", product?.price);
        setValue("quantity", product?.quantity);
        setValue("description", product?.description);
    }
}, [update, product]);

// Load categories when creating new product
useEffect(() => {
    if (!update) {
        dispatch(loadCategoryList());
    }
}, [dispatch, update]);

// Auto-select first category when categories load
useEffect(() => {
    if (!categoryLoader && categoryList) {
        setSelectedCategory(categoryList[0]);
    }
}, [categoryList, categoryLoader]);

// Show error if there's a problem loading categories
if (errorMessage) return <ErrorDisplay message={errorMessage} />

return (
  <div className='py-5 relative h-full'>
      <form className='space-y-4'
          onSubmit={handleSubmit(saveProductHandler)}>
          {/* Product name and category row */}
          <div className='flex md:flex-row flex-col gap-4 w-full'>
              <TextInput
                  label="Product Name"
                  required
                  id="productName"
                  type="text"
                  message="This field is required*"
                  register={register}
                  placeholder="Product Name"
                  errors={errors}
                  />

              {/* Only show category dropdown when creating new product */}
              {!update && (
                  <SelectDropdown
                      label="Select Categories"
                      select={selectedCategory}
                      setSelect={setSelectedCategory}
                      lists={categoryList}
                  />
              )}
          </div>

          {/* Price and quantity row */}
          <div className='flex md:flex-row flex-col gap-4 w-full'>
              <TextInput
                  label="Price"
                  required
                  id="price"
                  type="number"
                  message="This field is required*"
                  placeholder="Product Price"
                  register={register}
                  errors={errors}
                  />

                  <TextInput
                  label="Quantity"
                  required
                  id="quantity"
                  type="number"
                  message="This field is required*"
                  register={register}
                  placeholder="Product Quantity"
                  errors={errors}
                  />
          </div>

      {/* Description field */}
      <div className="flex flex-col gap-2 w-full">
          <label htmlFor='desc'
            className='font-semibold text-sm text-slate-800'>
              Description
          </label>

          <textarea
              rows={5}
              placeholder="Add product description...."
              className={`px-4 py-2 w-full border outline-hidden bg-transparent text-slate-800 rounded-md ${
                  errors["description"]?.message ? "border-red-500" : "border-slate-700"
              }`}
              maxLength={255}
              {...register("description", {
                  required: {value: true, message:"Description is required"},
              })}
              />

              {/* Show error message if description is invalid */}
              {errors["description"]?.message && (
                  <p className="text-sm font-semibold text-red-600 mt-0">
                      {errors["description"]?.message}
                  </p>
              )}
      </div>

      {/* Cancel and Save buttons */}
      <div className='flex w-full justify-between items-center absolute bottom-14'>
          <Button disabled={loader}
                  onClick={() => setOpen(false)}
                  variant='outlined'
                  className='text-white py-[10px] px-4 text-sm font-medium'>
              Cancel
          </Button>

          <Button
              disabled={loader}
              type='submit'
              variant='contained'
              color='primary'
              className='bg-custom-blue text-white  py-[10px] px-4 text-sm font-medium'>
              {loader ? (
                  <div className='flex gap-2 items-center'>
                       Loading...
                  </div>
              ) : (
                  "Save"
              )}
          </Button>
      </div>
      </form>
  </div>
)
}

export default AddProductForm
