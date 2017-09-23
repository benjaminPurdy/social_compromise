class StateController < ApplicationController
  def map_data
    @states_map_data = []
    states = State.all
    states.each do |state|
      representatives = state.representatives.all
      house_representatives = representatives.select { |representative| representative.house == true}
      senate_representatives = representatives.select { |representative| representative.senate == true}
      state = {
          name: state.first_letter_uppercased,
          flag: state.flag_name,
          population: state.population,
          id: 'US.' + state.abbreviation,
          house_representatives: {
              total: house_representatives.length,
              republican: (house_representatives.select { |representative| representative.party == 'Republican'}).length,
              democrat: (house_representatives.select { |representative| representative.party == 'Democrat'}).length,
              other: (house_representatives.select { |representative| representative.party == 'Other'}).length
          },
          senate_representatives: {
              total: senate_representatives.length,
              republican: (senate_representatives.select { |representative| representative.party == 'Republican'}).length,
              democrat: (senate_representatives.select { |representative| representative.party == 'Democrat'}).length,
              other: (senate_representatives.select { |representative| representative.party == 'Other'}).length
          },
          public_opinion: {
              total: 5,
              republican: 3,
              democrat: 2,
              other: 0
          },
          party_influence: 400
      }
      @states_map_data.push(state)
    end
    puts '-' * 100
    puts @states_map_data.inspect
    puts '-' * 100

    respond_to do |format|
      format.json { render json: @states_map_data }
    end
  end

end
