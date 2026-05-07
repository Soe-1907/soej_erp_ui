import { ref } from "vue";
import type { CustomerQuery, CustomerVO, CustomerDto } from "@/type/customer";
import {
  queryAllCustomersApi,
  updateCustomerApi,
  addCustomerApi,
  getCustomerByIdApi,
  enableCustomerApi,
  disableCustomerApi,
} from "@/api/product/customer";

export function useCustomer() {
  const CustomerList = ref<CustomerVO[]>([]);
  const total = ref(0); // 总数据条数
  const CustomerQuery = ref<CustomerQuery>({
    pageNum: 1,
    pageSize: 10,
    keyword: "",
    status: undefined,
    createdStartDate: undefined,
    createdEndDate: undefined,
  });

  // 查询客户列表
  const getAllCustomers = async () => {
    const res = await queryAllCustomersApi(CustomerQuery.value);
    CustomerList.value = res.data.list;
    total.value = res.data.total || 0;
  };

  const handleBanCustomer = async (row: CustomerVO, nextStatus: number) => {
    if (nextStatus === 1) {
      await enableCustomerApi(row.customerId);
    } else {
      await disableCustomerApi(row.customerId);
    }
    await getAllCustomers();
  };

  // 重置查询条件
  const resetQuery = () => {
    CustomerQuery.value = {
      pageNum: 1,
      pageSize: 10,
      keyword: "",
      status: undefined,
      createdStartDate: undefined,
      createdEndDate: undefined,
    };
    getAllCustomers();
  };

  // 新增客户
  const createCustomer = async (dto: CustomerDto) => {
    await addCustomerApi(dto);
    await getAllCustomers();
  };

  // 修改客户
  const editCustomer = async (dto: CustomerDto) => {
    await updateCustomerApi(dto);
    await getAllCustomers();
  };

  // 获取客户详情
  const getCustomerById = async (id: number) => {
    const res = await getCustomerByIdApi(id);
    return res.data;
  };

  return {
    CustomerList,
    CustomerQuery,
    total,
    getAllCustomers,
    handleBanCustomer,
    createCustomer,
    editCustomer,
    resetQuery,
    getCustomerById,
  };
}

