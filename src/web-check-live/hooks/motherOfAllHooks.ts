import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import type { LoadingState } from 'web-check-live/components/misc/ProgressBar';
import type { AddressType } from 'web-check-live/utils/address-type-checker';
import keys from 'web-check-live/utils/get-keys';

interface UseIpAddressProps<ResultType = any> {
  // 此作业类型的唯一标识符
  jobId: string | string[];
  // 实际的获取请求
  fetchRequest: () => Promise<ResultType>;
  // 调用此函数以更新父组件中的加载状态
  updateLoadingJobs: (job: string | string[], newState: LoadingState, error?: string, retry?: (data?: any) => void | null, data?: any) => void;
  addressInfo: {
    // 我们正在检查的主机名/IP地址
    address: string | undefined;
    // 地址类型（例如：url、ipv4）
    addressType: AddressType;
    // 此作业的有效地址类型
    expectedAddressTypes: AddressType[];
  };
}

type ResultType = any;

type ReturnType = [ResultType | undefined, (data?: any) => void];

// 通用的数据获取hook，用于处理各种类型的数据请求
const useMotherOfAllHooks = <ResultType = any>(params: UseIpAddressProps<ResultType>): ReturnType => {
  // 解构参数
  const { addressInfo, fetchRequest, jobId, updateLoadingJobs } = params;
  const { address, addressType, expectedAddressTypes } = addressInfo;

  // 构建将要返回的useState
  const [result, setResult] = useState<ResultType>();

  // 发起HTTP获取请求，然后设置结果并更新加载/错误状态

  const doTheFetch = () => {
    // 如果禁用了所有功能，则跳过
    if (keys.disableEverything) {
      updateLoadingJobs(jobId, 'skipped', 'Web-Check暂时已禁用。请稍后再试。', reset);
      return Promise.resolve();
    }
    return fetchRequest()
    .then((res: any) => {
      if (!res) { // 没有响应 :(
        updateLoadingJobs(jobId, 'error', '没有响应', reset);
      } else if (res.error) { // 响应返回了错误消息
        if (res.error.includes("timed-out")) { // 对超时错误的特殊处理
          updateLoadingJobs(jobId, 'timed-out', res.error, reset);
        } else {
          updateLoadingJobs(jobId, 'error', res.error, reset);
        }
      } else if (res.errorType && res.errorMessage) {
        const errorMessage = `${res.errorType}\n${res.errorMessage}\n\n`
        + `这有时会在使用免费计划的Netlify上发生。您可能需要升级以使用lambda函数`;
        updateLoadingJobs(jobId, 'error', errorMessage, reset);
      } else if (res.skipped) { // 响应返回了跳过消息
        updateLoadingJobs(jobId, 'skipped', res.skipped, reset);
      } else { // 耶，一切都按计划进行 :)
        setResult(res);
        updateLoadingJobs(jobId, 'success', '', undefined, res);
      }
    })
    .catch((err) => {
      // 出错了
      updateLoadingJobs(jobId, 'error', err.error || err.message || '未知错误', reset);
      throw err;
    })
  }

  // 当用户手动重新触发作业时使用
  const reset = (data: any) => {
    // 如果提供了数据，则更新状态
    if (data && !(data instanceof Event) && !data?._reactName) {
      setResult(data);
    } else { // 否则，触发数据重新获取
      updateLoadingJobs(jobId, 'loading');
      const fetchyFetch = doTheFetch();
      const toastOptions = {
        pending: `正在更新数据 (${jobId})`,
        success: `已完成 (${jobId})`,
        error: `更新失败 (${jobId})`,
        skipped: `已跳过作业 (${jobId})，因为主机没有有效结果`,
      };
      // 发起获取，并显示进度提示
      toast.promise(fetchyFetch, toastOptions).catch(() => {});
    }
  };

  useEffect(() => {
    // 还在等待上游数据，取消作业
    if (!address || !addressType) {
      return;
    }
    // 此作业不需要此地址类型，取消作业
    if (!expectedAddressTypes.includes(addressType)) {
      if (addressType !== 'empt') updateLoadingJobs(jobId, 'skipped');
      return;
    }

    // 发起数据获取过程
    doTheFetch().catch(() => {});
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, addressType]);

  return [result, reset];
};

export default useMotherOfAllHooks;

// 我有时候真的讨厌TypeScript....
// 感觉它只是试图让JavaScript不那么糟糕的弱尝试，
// 真正的解决方案应该是切换到一个真正的、类型安全的语言
// ... 要么就是我真的不擅长它。
