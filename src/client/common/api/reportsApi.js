import baseApi from './baseApi';


export const reportsApi = {
  getAllReports(params) {
    return baseApi.ajax({
      method: 'get',
      url: '/reports'
    }, params)
      .then(res => res.data)
      .then(data => data.map(report => {
        return {
          week: report.week,
          averageDistance: Math.round(report.averageDistance),
          averageSpeed: report.averageSpeed.toFixed(2)
        };
      }));
  }
};
