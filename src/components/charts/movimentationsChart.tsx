"use client"

import dynamic from "next/dynamic";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MovimentationsChart(){

  function getPreviousMonthName(monthsBefore: number) {
    const date = new Date();
    date.setMonth(date.getMonth() - monthsBefore);
    return date.toLocaleString('default', { month: 'long' }); // Retorna apenas o nome do mês
  }
  
  const categories = [];
  
  for (let i = 0; i < 9; i++) { // Alterado para os últimos 6 meses
    categories.push(getPreviousMonthName(i));
  }

  const option = {
    chart: {
      height: 350,
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    xaxis:  {
      type: 'category',
      categories: categories.reverse() // Reverter a ordem para exibir do mais recente para o mais antigo
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (value: string) => value
      }
    },
    grid: {
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    toolbar: {
      show: false
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      }
    },
    }

    const series = [{
      name: 'Operações',
      data: [31, 40, 28, 70, 42, 83, 30, 10, 50]// Ajustado para os últimos 6 meses
    }]

    return(
        <>
            <ApexChart type="area" options={option} series={series} height={"100%"} width={"100%"} />
        </>
    )
    
}
