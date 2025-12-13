import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllCustomersDashboard } from "../../../../store/actions";

const useCustomerFilter = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams();
    const currentPage = searchParams.get("page") ? Number(searchParams.get("page")) : 1;
    params.set("pageNumber", currentPage - 1);
    dispatch(getAllCustomersDashboard(params.toString()));
  }, [dispatch, searchParams]);
};

export default useCustomerFilter;
