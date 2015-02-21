module Faker
  class Community < Base
    class << self

      def name
        parse('community.name')
      end

      def uuid
        uuid_array = [generate_random_characters(8),
                      generate_random_characters(4),
                      generate_random_characters(4),
                      generate_random_characters(12)]
        uuid_array.join('-')
      end

      private
      def generate_random_characters(char_count)
        ([*('a'..'z'),*('0'..'9')]-%w(0 1 I O)).sample(char_count).join
      end

    end

  end
end