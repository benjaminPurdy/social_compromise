module SuggestionHelper
  def suggestions(type, amount, participants, displayed_movies)
    case type
      when :movie
        return movie_suggestions(amount, participants, displayed_movies)
      else
        return []
    end
  end

  private

  def movie_suggestions(amount, participants, displayed_movies)
    if (amount <= 0)
      return []
    end

    updated_displayed_movies = displayed_movies
    suggestions = []
    sample_user = participants.sample
    similar_movies = valid_similar_movies(sample_user, amount, updated_displayed_movies)
    suggestions.concat similar_movies
    puts "similar movies"
    puts similar_movies.inspect
    puts similar_movies.count
    puts "-"  * 100
    if (suggestions.count >= amount)
      return suggestions
    end
    recommendations = valid_recommendations(amount - suggestions.count, updated_displayed_movies)
    puts "recommendations"
    puts recommendations.inspect
    puts recommendations.count
    puts "-"  * 100
    suggestions.concat recommendations
    if (suggestions.count >= amount)
      return suggestions.flatten
    end
    top_movies = valid_top_movies(amount - suggestions.count, updated_displayed_movies)
    puts "top_movies"
    puts top_movies.inspect
    puts top_movies.count
    puts "-"  * 100
    suggestions.concat top_movies
    if (suggestions.count >= amount)
      return suggestions.flatten
    end
    random_movies =random_movies(amount - suggestions.count, updated_displayed_movies)
    puts "random_movies"
    puts random_movies.inspect
    puts random_movies.count
    puts "-"  * 100
    suggestions.cancat random_movies
    suggestions.push(random_movies(amount - suggestions.count, updated_displayed_movies))
    if (suggestions.count >= amount)
      return suggestions.flatten
    end
    puts "ERROR " * 100
    suggestions.flatten
  end

  def random_movies(max, displayed_movies)
    random_movies = []
    until random_movies.count == max
      offset = rand(Movie.count)
      random_movie = Movie.offset(offset).first
      if is_valid_movie?(random_movie, displayed_movies )
        random_movies.push(Movie.offset(offset).first)
      end
    end

    return random_movies
  end

  def valid_top_movies(max, displayed_movies)
    valid_top_movies = []
    top_movies = Movie.top(count: 100).shuffle
    top_movies.each_with_index do |top_movie, index|
      if index > 10
        return valid_top_movies
      end
      if is_valid_movie?(top_movie, displayed_movies)
        valid_top_movies.push top_movie
      end
      if valid_top_movies.count >= max
        return valid_top_movies;
      end
    end
    valid_top_movies

  end

  def valid_recommendations(max, displayed_movies)
    valid_recommendations = []
    recommendations = current_user.recommended_movies(10).shuffle
    recommendations.each do |recommendation|
      if is_valid_movie?(recommendation, displayed_movies)
        valid_recommendations.push recommendation
      end
      if valid_recommendations.count >= max
        return valid_recommendations;
      end
    end
    valid_recommendations
  end

  def valid_similar_movies(user, max, displayed_movies)
    valid_similar_movies = []
    similar_movies = current_user.liked_movies_in_common_with(user).shuffle
    similar_movies.each do |similar_movie|
      if is_valid_movie?(similar_movie, displayed_movies)
        valid_similar_movies.push similar_movie
      end
      if valid_similar_movies.count >= max
        return valid_similar_movies;
      end
    end
    valid_similar_movies
  end

  def is_valid_movie?(movie, displayed_movies)
    !contains_movie(displayed_movies, movie)
  end

  def contains_movie(movie_list, specific_movie)
    movie_list.each do |movie|
      if movie.id == specific_movie.id
        return true
      end
    end
    false
  end

  def has_already_voted_on_movie? (compromise_id, movie)
    if CompromiseUserMovieVoteMapping.find_by(user_id: current_user.id, compromise_id: compromise_id, movie_id: movie.id)
        return true;
    end
    return false;
  end
end
