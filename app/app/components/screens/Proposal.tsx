import React from 'react'
import Card from '../Card'

const Proposal = () => {
  return (
    <Card>
      <main className='flex overflow-y-auto h-full'>
        <div className='flex flex-col gap-y-3 w-full'>
          <section className='bg-[#F8F8F8] rounded-[10px] p-[30px] flex flex-col gap-y-5'>
            <div>
              <p>Proposal by:</p>
              <div>
                <h5>Username234</h5>
              </div>
            </div>

            <p>Proposal ID: A100</p>

            <div>
              <p>Status</p>
              <div className='border border-[#60CF0B] px-[10px] py-[4px] w-fit rounded-[8px]'>Active</div>
            </div>

            <div>
              <p>Title</p>
              <h4 className=''>Book Exchange Initiative Exchange Initiative</h4>
            </div>
          </section>
          <section className='bg-[#F8F8F8] rounded-[10px] p-[20px]'>
            <h3>Timeline</h3>

            <div className='flex flex-col gap-y-4'>
              <span>
                <p>Start date</p>
                <h4>01/02/2025</h4>
              </span>

              <div className='w-[65px] h-[1px] bg-[#777777]'></div>

              <span>
                <p>Start date</p>
                <h4>01/02/2025</h4>
              </span>
            </div>
          </section>
          <section className='bg-[#F8F8F8] rounded-[10px] p-[20px]'></section>
          <section className='bg-[#F8F8F8] rounded-[10px] p-[20px]'></section>
        </div>
      </main>
    </Card>
  )
}

export default Proposal